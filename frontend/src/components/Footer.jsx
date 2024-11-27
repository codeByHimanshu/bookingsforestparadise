import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#333',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        marginTop: '20px',
      }}
    >
      <div>
        {/* Privacy Policy Links */}
        <p>
          <a
            href="/privacy-policy"
            style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}
          >
            Privacy Policy
          </a>
          |
          <a
            href="/terms-of-service"
            style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}
          >
            Terms of Service
          </a>
          |
          <a
            href="/cookie-policy"
            style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}
          >
            Cookie Policy
          </a>
        </p>
      </div>

      <div style={{ marginTop: '10px' }}>
        {/* Social Media Links */}
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#fff', margin: '0 10px', fontSize: '20px' }}
        >
          Facebook
        </a>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#fff', margin: '0 10px', fontSize: '20px' }}
        >
          Twitter
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#fff', margin: '0 10px', fontSize: '20px' }}
        >
          Instagram
        </a>
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#fff', margin: '0 10px', fontSize: '20px' }}
        >
          LinkedIn
        </a>
      </div>

      <div style={{ marginTop: '20px' }}>
        <p>&copy; 2024 Forest Paradise Resort. All rights reserved.</p>
      </div>
    </footer>
  );
};
   
export default Footer;
