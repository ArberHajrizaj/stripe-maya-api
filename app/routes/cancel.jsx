export default function Cancel() {
  const handleBackToStore = () => {
    window.location.href = "/"; 
  };

  return (
    <div className="canceled">
      <h1>Payment Canceled</h1>
      <p>There was an issue with your payment. Please try again or contact support.</p>
      <button className="backToStoreButton" onClick={handleBackToStore}>
        Back to Store
      </button>
    </div>
  );
}
