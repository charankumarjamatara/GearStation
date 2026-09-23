import type { CartItem } from '../CartContext';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface OrderNotificationData {
  customer: CustomerDetails;
  items: CartItem[];
  total: number;
}

// In-memory deduplication set to avoid duplicate dispatches (e.g. React StrictMode or rapid clicks)
const dispatchedSignatures = new Set<string>();

/**
 * Dispatch notification payload to our own secure backend endpoint (/api/send-notification)
 */
async function postNotificationToBackend(payload: {
  type: 'contact' | 'order';
  data: any;
}): Promise<{ success: boolean; error?: string }> {
  // 1. Try sending through local / serverless backend endpoint
  try {
    const response = await fetch('/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const resData = await response.json();
      if (resData.success) {
        return { success: true };
      }
    }
  } catch (err: any) {
    console.warn('Backend endpoint unavailable, falling back to direct FormSubmit delivery:', err?.message || err);
  }

  // 2. Direct client fallback via FormSubmit if backend is unavailable
  try {
    const isContact = payload.type === 'contact';
    const subject = isContact 
      ? 'From Contact Form' 
      : `Order By ${payload.data.customer.fullName}`;
    const replyTo = isContact 
      ? payload.data.email 
      : payload.data.customer.email;

    let textContent = '';
    if (isContact) {
      textContent = [
        'From Contact Form',
        '',
        'CUSTOMER DETAILS',
        '────────────────────────',
        '',
        'Name:',
        payload.data.name,
        '',
        'Email:',
        payload.data.email,
        '',
        'Phone:',
        payload.data.phone || 'N/A',
        '',
        'MESSAGE',
        '────────────────────────',
        '',
        payload.data.message
      ].join('\n');
    } else {
      const { customer, items, total } = payload.data;
      const itemBlocksText = items.map((item: any, idx: number) => [
        `Item ${idx + 1}:`,
        item.name,
        '',
        'Pickup Date:',
        item.startDate || 'N/A',
        '',
        'Return Date:',
        item.endDate || 'N/A',
        '',
        'Rental Duration:',
        `${item.totalDays} day${item.totalDays > 1 ? 's' : ''}`,
        '',
        'Item Price:',
        `₹${Number(item.totalPrice).toLocaleString('en-IN')}`,
        '',
        '────────────────────────'
      ].join('\n')).join('\n\n');

      textContent = [
        'Order By:',
        customer.fullName,
        '',
        'CUSTOMER DETAILS',
        '────────────────────────',
        '',
        'Name:',
        customer.fullName,
        '',
        'Email:',
        customer.email,
        '',
        'Phone:',
        customer.phone || 'N/A',
        '',
        'RENTAL DETAILS',
        '────────────────────────',
        '',
        itemBlocksText,
        '',
        'ORDER SUMMARY',
        '────────────────────────',
        '',
        'Total Items:',
        String(items.length),
        '',
        'Total Estimated Cost:',
        `₹${Number(total).toLocaleString('en-IN')}`
      ].join('\n');
    }

    const fsResponse = await fetch('https://formsubmit.co/ajax/6b71ac1f2f98c1c5c78b6be912a3c84d', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _replyto: replyTo,
        _captcha: 'false',
        _template: 'box',
        Message_Content: textContent
      })
    });

    const fsJson = await fsResponse.json();
    return { success: fsJson.success === 'true' || fsJson.success === true };
  } catch (clientErr: any) {
    console.error('Direct email dispatch failed:', clientErr);
    return { success: false, error: clientErr?.message || 'Failed to dispatch email' };
  }
}

/**
 * Workflow A: Send Contact Form Notification
 */
export async function sendContactNotification(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
    return { success: false, error: 'Required fields missing' };
  }

  // Deduplication check
  const sig = `contact_${data.name}_${data.email}_${data.message.slice(0, 30)}`;
  if (dispatchedSignatures.has(sig)) {
    return { success: true };
  }
  dispatchedSignatures.add(sig);

  return postNotificationToBackend({
    type: 'contact',
    data: {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || '',
      message: data.message.trim()
    }
  });
}

/**
 * Workflow B: Send Customer Order / Booking Notification
 */
export async function sendOrderNotification(data: OrderNotificationData): Promise<{ success: boolean; error?: string }> {
  if (!data.customer?.fullName?.trim() || !data.customer?.email?.trim() || !data.items || data.items.length === 0) {
    return { success: false, error: 'Required order data missing' };
  }

  // Deduplication check
  const sig = `order_${data.customer.email}_${data.customer.phone}_${data.items.map(i => i.id).join('_')}_${data.total}`;
  if (dispatchedSignatures.has(sig)) {
    return { success: true };
  }
  dispatchedSignatures.add(sig);

  // Snapshot clean serialized items
  const cleanItems = data.items.map(item => ({
    id: item.id,
    name: item.name,
    startDate: item.startDate,
    endDate: item.endDate,
    totalDays: item.totalDays,
    totalPrice: item.totalPrice,
    price: item.price
  }));

  return postNotificationToBackend({
    type: 'order',
    data: {
      customer: {
        fullName: data.customer.fullName.trim(),
        email: data.customer.email.trim(),
        phone: data.customer.phone.trim()
      },
      items: cleanItems,
      total: data.total
    }
  });
}
