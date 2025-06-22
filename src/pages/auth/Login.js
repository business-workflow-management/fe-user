import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { 
  Button, 
  Input, 
  Card, 
  Container, 
  Heading, 
  Paragraph, 
  Flex, 
  Space, 
  Link 
} from '../../components/ui';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Mock login - any email/password combination will work
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/projects');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Container 
      as="main" 
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12"
      maxWidth="sm"
      center
    >
      <Space size="xl" className="w-full">
        <Flex direction="col" align="center">
          <Heading level={2} size="3xl" weight="bold" color="default">
            Welcome back
          </Heading>
          <Paragraph size="sm" color="secondary" align="center">
            Sign in to your account
          </Paragraph>
        </Flex>

        <Card>
          <form onSubmit={handleSubmit}>
            <Space size="lg">
              <Input
                label="Email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                leftIcon={<Mail size={16} className="text-gray-400" />}
                placeholder="Enter your email"
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                leftIcon={<Lock size={16} className="text-gray-400" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                placeholder="Enter your password"
                required
              />

              <Flex justify="between" align="center">
                <Flex align="center" gap="sm">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="text-sm text-gray-900">
                    Remember me
                  </label>
                </Flex>

                <Link variant="primary" size="sm">
                  Forgot your password?
                </Link>
              </Flex>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
              >
                Sign in
              </Button>

              <Paragraph size="sm" color="secondary" align="center">
                Don't have an account?{' '}
                <Link to="/register" variant="primary">
                  Sign up
                </Link>
              </Paragraph>
            </Space>
          </form>
        </Card>

        {/* Demo credentials */}
        <Paragraph size="xs" color="secondary" align="center">
          Demo: Use any email and password to login
        </Paragraph>
      </Space>
    </Container>
  );
};

export default Login; 