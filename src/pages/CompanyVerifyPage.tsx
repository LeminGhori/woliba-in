import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyCompany } from '../api/registrationApi';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorAlert from '../components/ErrorAlert';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setCompany,
  setLoading,
  setError,
  clearError,
} from '../redux/registrationSlice';
import { validateCompanyPassword } from '../utils/validations';
import { ROUTES } from '../utils/constants';

type FieldErrors = Partial<Record<'companyName' | 'password', string>>;

export default function CompanyVerifyPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.registration);

  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value) {
      setFieldErrors((prev) => ({
        ...prev,
        password: validateCompanyPassword(value),
      }));
    } else {
      setFieldErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearError());

    const errors: FieldErrors = {};
    if (!companyName.trim()) errors.companyName = 'Company name is required.';
    const passwordError = validateCompanyPassword(password);
    if (passwordError) errors.password = passwordError;

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    dispatch(setLoading(true));

    try {
      const response: any = await verifyCompany(companyName.trim(), password);
      const company = response?.data?.[0];
      if (!company) {
        throw new Error(
          'Company verification failed. Please check your credentials.'
        );
      }
      dispatch(setCompany(company));
      navigate(ROUTES.USER_DETAILS);
    } catch (err) {
      dispatch(setError((err as Error).message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Layout pageTitle="Registration">
      <ErrorAlert message={error} />
      <form onSubmit={handleSubmit}>
        <Input
          id="companyName"
          label="Company Name"
          placeholder="Enter Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          error={fieldErrors.companyName}
        />
        <Input
          id="password"
          label="Company Password"
          type="password"
          placeholder="Enter Company Password"
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => {
            if (password) {
              setFieldErrors((prev) => ({
                ...prev,
                password: validateCompanyPassword(password),
              }));
            }
          }}
          error={fieldErrors.password}
        />
        <Button type="submit" loading={loading} className="btn--block">
          Next
        </Button>
      </form>
    </Layout>
  );
}

