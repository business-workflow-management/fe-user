import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
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

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      // Mock registration
      const result = await register(formData.name, formData.email, formData.password);
      
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/projects');
      } else {
        toast.error('Registration failed. Please try again.');
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
            Create your account
          </Heading>
          <Paragraph size="sm" color="secondary" align="center">
            Join our social marketing platform
          </Paragraph>
        </Flex>

        <Card>
          <form onSubmit={handleSubmit}>
            <Space size="lg">
              <Input
                label="Full name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                leftIcon={<User size={16} className="text-gray-400" />}
                placeholder="Enter your full name"
                required
              />

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
                placeholder="Create a password"
                required
              />

              <Input
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                leftIcon={<Lock size={16} className="text-gray-400" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                placeholder="Confirm your password"
                required
              />

              <Flex align="center" gap="sm">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  required
                />
                <Paragraph size="sm" color="default">
                  I agree to the{' '}
                  <Link variant="primary" size="sm">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link variant="primary" size="sm">
                    Privacy Policy
                  </Link>
                </Paragraph>
              </Flex>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
              >
                Create account
              </Button>

              <Paragraph size="sm" color="secondary" align="center">
                Already have an account?{' '}
                <Link to="/login" variant="primary">
                  Sign in
                </Link>
              </Paragraph>
            </Space>
          </form>
        </Card>

        {/* Demo info */}
        <Paragraph size="xs" color="secondary" align="center">
          Demo: Registration will create a mock account
        </Paragraph>
      </Space>
    </Container>
  );
};

export default Register; 