const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Confirmed': 'bg-blue-100 text-blue-800',
  'Processing': 'bg-purple-100 text-purple-800',
  'Ready for Delivery': 'bg-indigo-100 text-indigo-800',
  'Dispatched': 'bg-orange-100 text-orange-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'Returned': 'bg-gray-100 text-gray-800',
};

const OrderStatusBadge = ({ status }) => {
  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
};

export default OrderStatusBadge;
// chore: update 3 - 2026-06-14T10:31:37

// chore: update 50 - 2026-06-13T14:54:05
