import * as Contacts from 'expo-contacts';
import axios from 'axios';

export const syncContacts = async () => {
  try {
    // 1. Ask permission
    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== 'granted') {
      return;
    }

    // 2. Get contacts
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    // 3. Format data
    const contacts = data
      .filter((c: any) => c.phoneNumbers && c.phoneNumbers.length > 0)
      .map((c: any) => ({
        name: c.name,
        phone: c.phoneNumbers[0].number,
      }));

    // 4. Send to backend in batches to avoid size limits
    const chunkSize = 250;
    for (let i = 0; i < contacts.length; i += chunkSize) {
      const chunk = contacts.slice(i, i + chunkSize);
      await axios.post("https://contactappbackend-77ar.onrender.com/api/contacts", chunk);
    }

  } catch (err) {
    // Silently fail
  }
};
