import { json } from '@remix-run/node';
import { createMayaCustomer } from '../utils/mayaApi';

export const action = async ({ request }) => {
  try {
    const { email, first_name, last_name } = await request.json();
    if (!email || !first_name || !last_name) {
      throw new Error('Missing required fields: email, first name, or last name');
    }

    const mayaCustomer = await createMayaCustomer(email, first_name, last_name);
    return json({ mayaCustomer });
  } catch (error) {
    console.error('Error creating customer at Maya:', error);
    return json({ error: error.message }, { status: 500 });
  }
};
