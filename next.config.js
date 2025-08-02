/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    TN_COMPLIANCE_DAYS_REQUIRED: process.env.TN_COMPLIANCE_DAYS_REQUIRED || '180',
    TN_COMPLIANCE_HOURS_PER_DAY: process.env.TN_COMPLIANCE_HOURS_PER_DAY || '4',
  },
}

module.exports = nextConfig