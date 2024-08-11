// components/Header.tsx
import Link from 'next/link';

export const BlogPostHeaderNavigation = () => {
  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '1rem' }}>
          <li><Link href="/blog">Home</Link></li>
          <li><Link href="https://beacons.ai/coach.with.santosh">About</Link></li>
          <li><Link href="https://beacons.ai/coach.with.santosh">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
};

