import * as React from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { 
  useCreateListingMutation, 
  useUpdateListingMutation, 
  useGetListingQuery 
} from '../api/listingApi';

export function useListingWizard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const listingId = searchParams.get('id') || params.id;
  const typeParam = searchParams.get('type');

  React.useEffect(() => {
    console.log('[useListingWizard] listingId resolved:', listingId, 'from params:', params.id, 'from search:', searchParams.get('id'));
  }, [listingId, params.id, searchParams]);
  
  const { data: listing, isLoading: isFetching } = useGetListingQuery(listingId || '', {
    skip: !listingId
  });

  const [createListing, { isLoading: isCreating }] = useCreateListingMutation();
  const [updateListing, { isLoading: isUpdating }] = useUpdateListingMutation();

  const [localData, setLocalData] = React.useState<any>(null);

  // Sync initial data from API to local state
  React.useEffect(() => {
    if (listing?.data && !localData) {
      setLocalData(listing.data);
    }
  }, [listing, localData]);

  // Initial draft creation if no ID
  React.useEffect(() => {
    async function initDraft() {
      if (!listingId && typeParam) {
        try {
          // Map Russian types back to enum if necessary
          const typeMap: Record<string, string> = {
            'Квартира': 'APARTMENT',
            'Дом': 'HOUSE',
            'Комната': 'ROOM',
            'Гостиница': 'ROOM' // Default to ROOM for hotel room
          };
          const type = typeMap[typeParam] || 'APARTMENT';
          
          const result = await createListing({ type, stepsCompleted: 1 }).unwrap();
          if (result.success) {
            setSearchParams({ type: typeParam, id: result.data.id, step: '1' });
          }
        } catch (error) {
          console.error('Failed to create draft:', error);
        }
      }
    }
    initDraft();
  }, [listingId, typeParam, createListing, setSearchParams]);

  const updateField = (fields: any) => {
    setLocalData((prev: any) => ({ ...prev, ...fields }));
  };

  // Sanitization to send only allowed fields to the backend
  const sanitizeListingData = (raw: any) => {
    if (!raw) return {};
    const allowed = [
      'type', 'title', 'description', 'city', 'streetName', 
      'houseNumber', 'address', 'pricePerDay', 'amenities', 
      'details', 'stepsCompleted'
    ];
    return Object.fromEntries(
      Object.entries(raw).filter(([key]) => allowed.includes(key))
    );
  };

  // Debounced auto-save
  React.useEffect(() => {
    if (!listingId || !localData) return;

    const timeout = setTimeout(async () => {
      try {
        const sanitized = sanitizeListingData(localData);
        await updateListing({ id: listingId, data: sanitized }).unwrap();
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [localData, listingId, updateListing]);

  return {
    listingId,
    listing: localData || listing?.data,
    isFetching,
    isSaving: isCreating || isUpdating,
    updateField,
    step: parseInt(searchParams.get('step') || '1'),
    setStep: (s: number) => setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('step', s.toString());
      return p;
    })
  };
}
