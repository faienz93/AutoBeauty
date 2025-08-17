interface StatusIndicatorProp {
  status: {
    text: string;
    color: string;
  };
  textColor: string;
}

const StatusIndicator: React.FC<StatusIndicatorProp> = ({ status, textColor }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', margin: '0 auto 32px auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '25px',
          padding: '12px 24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
        }}>
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: status.color,
            borderRadius: '50%',
            marginRight: '12px',
            boxShadow: `0 0 8px ${status.color}60`,
          }}
        />
        <span
          style={{
            color: textColor,
            fontSize: '14px',
            fontWeight: '500',
          }}>
          {status.text}
        </span>
      </div>
    </div>
  );
};

export default StatusIndicator;
