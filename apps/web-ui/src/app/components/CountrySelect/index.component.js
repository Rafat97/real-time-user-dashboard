import { Select } from '@mantine/core';

export default function CountrySelect(props) {
  return (
    <Select
      data={[
        { value: 'Bangladesh', label: 'Bangladesh' },
        { value: 'Canada', label: 'Canada' },
        { value: 'India', label: 'India' },
        { value: 'United Arab Emirates', label: 'United Arab Emirates' },
        { value: 'United Kingdom', label: 'United Kingdom' },
        { value: 'United States', label: 'United States' },
      ]}
      {...props}
    />
  );
}
