import { post } from 'utils/api';
import { useMutation } from 'react-query';

export const ServiceQuery = () => {
  const mutation = useMutation((values) => post('/api/shipment', values).then((res) => res.data));

  return mutation;
};

export const PrintingServiceQuery = () => {
  const mutation = useMutation((value) => post('/api/shipment/printing-shipment', value).then((res) => res.data));
  
  return mutation;
}

// export default ServiceQuery;
