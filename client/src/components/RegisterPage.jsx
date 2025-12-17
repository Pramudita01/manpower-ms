import { AlertCircle, ArrowRight, Home, Key, Loader2, Lock, Mail, User, UserPlus } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const RegisterInput = React.memo(({
    type,
    placeholder,
    value,
    onChange,
    label,
    Icon,
    disabled,
    className = '',
    autoFocus = false,
    clearError
}) => {
    const IconComponent = Icon;

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    {Icon && <IconComponent className="h-4 w-4 text-gray-400" />}
                </div>
                <Input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => {
                        onChange(e);
                        clearError();
                    }}
                    autoComplete={type === 'email' ? 'email' : (type === 'password' ? 'new-password' : 'name')}
                    disabled={disabled}
                    autoFocus={autoFocus}
                    className={`pl-10 pr-4 h-12 text-base bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:ring-offset-transparent focus:border-transparent transition-all duration-200 ${className}`}
                />
            </div>
        </div>
    );
});
RegisterInput.displayName = 'RegisterInput';

export function RegisterPage({ onRegister, onSwitchToLogin }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [autoFocusEmail, setAutoFocusEmail] = useState(true);

    // Using 'username' state to map to backend requirements, but labeled as 'fullName' in UI
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [companyName, setCompanyName] = useState('');

    const handleSetUsername = useCallback(e => setUsername(e.target.value), []);
    const handleSetEmail = useCallback(e => setEmail(e.target.value), []);
    const handleSetPassword = useCallback(e => setPassword(e.target.value), []);
    const handleSetConfirmPassword = useCallback(e => setConfirmPassword(e.target.value), []);
    const handleSetCompanyName = useCallback(e => setCompanyName(e.target.value), []);

    const clearError = useCallback(() => {
        if (error) setError('');
    }, [error]);

    const validateRegistration = () => {
        if (!username) return 'Please enter your Full Name';
        if (!email || !email.includes('@')) return 'Please enter a valid email format';
        if (!companyName) return 'Please enter your Company Name';
        if (!password || password.length < 6) return 'Password must be at least 6 characters';
        if (password !== confirmPassword) return 'Passwords do not match';
        return '';
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const validationError = validateRegistration();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            // Sending 'username' state which now contains the Full Name string
            await onRegister(username, email, password, 'admin', companyName);
        } catch (e) {
            setError(e.message || 'Registration failed. The email might already be in use.');
        } finally {
            setIsLoading(false);
        }
    }, [username, email, password, confirmPassword, companyName, onRegister]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
            <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-2xl shadow-2xl border-0">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                        <UserPlus className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                        Admin Registration
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-2 flex items-center justify-center gap-2">
                        <Lock className="h-4 w-4" />
                        Create Your Company's Master Account
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-3 text-red-700">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <RegisterInput
                            type="text"
                            placeholder="John Doe"
                            value={username}
                            onChange={handleSetUsername}
                            label="Full Name"
                            Icon={User}
                            disabled={isLoading}
                            className="focus:ring-blue-500"
                            autoFocus={autoFocusEmail}
                            clearError={clearError}
                        />
                        <RegisterInput
                            type="email"
                            placeholder="admin@company.com"
                            value={email}
                            onChange={handleSetEmail}
                            label="Work Email"
                            Icon={Mail}
                            disabled={isLoading}
                            className="focus:ring-blue-500"
                            clearError={clearError}
                        />
                        <RegisterInput
                            type="text"
                            placeholder="Your Company Name"
                            value={companyName}
                            onChange={handleSetCompanyName}
                            label="Company Name"
                            Icon={Home}
                            disabled={isLoading}
                            className="focus:ring-blue-500"
                            clearError={clearError}
                        />
                        <RegisterInput
                            type="password"
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={handleSetPassword}
                            label="Password"
                            Icon={Lock}
                            disabled={isLoading}
                            className="focus:ring-blue-500"
                            clearError={clearError}
                        />
                        <RegisterInput
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={handleSetConfirmPassword}
                            label="Confirm Password"
                            Icon={Key}
                            disabled={isLoading}
                            className="focus:ring-blue-500"
                            clearError={clearError}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 flex items-center justify-center gap-2 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg transition-all rounded-lg"
                        >
                            {isLoading ? (
                                <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                            ) : (
                                <><UserPlus className="h-5 w-5" /> Register Company Admin</>
                            )}
                        </Button>
                    </form>

                    <div className="text-center pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm rounded-lg"
                        >
                            Already have an account? Sign In <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}