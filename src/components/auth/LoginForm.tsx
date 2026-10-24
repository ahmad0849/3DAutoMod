import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Twitter, Mail, Lock, User, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type FormData = {
  email: string;
  password: string;
  name?: string;
  role?: 'owner' | 'mechanic';
};

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) throw error;

        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        // Store user data
        localStorage.setItem('user', JSON.stringify({ 
          name: profile.name,
          email: data.email,
          role: profile.role
        }));

        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
              role: data.role,
            },
          },
        });

        if (error) throw error;

        // Switch to login view after successful signup
        setIsLogin(true);
      }
    } catch (error: unknown) {
      setError('root', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto p-8 rounded-xl bg-black/40 backdrop-blur-lg border border-[#00ff8c]/10"
    >
      <h2 className="text-3xl font-orbitron text-white text-center mb-8">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {!isLogin && (
          <div>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                {...register("name", { 
                  required: "Name is required"
                })}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-gray-600 rounded-lg focus:border-[#00ff8c] focus:ring-1 focus:ring-[#00ff8c] text-white placeholder-gray-400"
                placeholder="Full Name"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>
        )}

        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-gray-600 rounded-lg focus:border-[#00ff8c] focus:ring-1 focus:ring-[#00ff8c] text-white placeholder-gray-400"
              placeholder="Email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              type="password"
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-gray-600 rounded-lg focus:border-[#00ff8c] focus:ring-1 focus:ring-[#00ff8c] text-white placeholder-gray-400"
              placeholder="Password"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
          )}
        </div>

        {!isLogin && (
          <div>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                {...register("role", { 
                  required: "Role is required"
                })}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-gray-600 rounded-lg focus:border-[#00ff8c] focus:ring-1 focus:ring-[#00ff8c] text-white placeholder-gray-400"
              >
                <option value="">Select Role</option>
                <option value="owner">Car Owner</option>
                <option value="mechanic">Mechanic</option>
              </select>
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-400">{errors.role.message}</p>
            )}
          </div>
        )}

        {errors.root && (
          <p className="text-red-400 text-sm text-center">{errors.root.message}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#00ff8c] to-[#0066ff] text-black font-bold rounded-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-[#00ff8c] hover:underline"
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </button>
      </div>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg hover:border-[#00ff8c] transition-colors duration-200">
            <Github className="h-5 w-5 text-white" />
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg hover:border-[#00ff8c] transition-colors duration-200">
            <Twitter className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginForm;