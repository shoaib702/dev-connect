const Loader = ({ size = 'medium' }) => {
    const sizeStyles = {
        small: { width: '24px', height: '24px', borderWidth: '3px' },
        medium: { width: '40px', height: '40px', borderWidth: '4px' },
        large: { width: '60px', height: '60px', borderWidth: '5px' },
    };

    const spinnerStyle = {
        ...sizeStyles[size],
        border: `${sizeStyles[size].borderWidth} solid rgba(99, 102, 241, 0.1)`,
        borderTop: `${sizeStyles[size].borderWidth} solid #6366f1`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    };

    return (
        <div style={spinnerStyle}>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Loader;
