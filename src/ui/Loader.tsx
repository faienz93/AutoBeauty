import './Loader.css';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
      }}>
      {/* REF: https://codepen.io/mandelid/pen/kNBYLJ */}
      <div id="loading"></div>
    </div>
  );
};

export default Loader;
