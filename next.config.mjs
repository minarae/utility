/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/json-editor',
        permanent: true,
      },
    ]
  },
  output: 'export',  // Static HTML 내보내기 설정
  images: {
    unoptimized: true  // 정적 내보내기를 위한 이미지 최적화 비활성화
  }
};

export default nextConfig;
