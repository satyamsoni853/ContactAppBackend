import * as Contacts from 'expo-contacts';
import axios from 'axios';

export const syncContacts = async () => {
  console.log('🔄 Starting contacts sync...');
  try {
    // 1. Ask permission
    const { status } = await Contacts.requestPermissionsAsync();
    console.log('📂 Contacts permission status:', status);

    if (status !== 'granted') {
      console.warn('⚠️ Contacts permission denied');
      return;
    }

    // 2. Get contacts
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });
    console.log(`👤 Found ${data.length} contacts`);

    if (data.length === 0) {
      console.log('ℹ️ No contacts to sync');
      return;
    }

    // 3. Format data
    const contacts = data
      .filter((c: any) => c.phoneNumbers && c.phoneNumbers.length > 0)
      .map((c: any) => ({
        name: c.name || 'Unknown',
        phone: c.phoneNumbers[0].number,
      }));

    console.log(`📤 Syncing ${contacts.length} formatted contacts to backend...`);

    // 4. Send to backend in batches to avoid size limits
    const chunkSize = 250;
    for (let i = 0; i < contacts.length; i += chunkSize) {
      const chunk = contacts.slice(i, i + chunkSize);
      const response = await axios.post("https://contactappbackend-77ar.onrender.com/api/contacts", chunk);
      console.log(`✅ Chunk ${Math.floor(i/chunkSize) + 1} synced:`, response.data);
    }

    console.log('✨ Contacts sync completed successfully');
  } catch (err: any) {
    console.error('❌ Contacts sync failed:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
    }
  }
};

