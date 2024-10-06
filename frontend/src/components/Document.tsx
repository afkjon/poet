import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDoc, onSnapshot, addDoc, doc } from 'firebase/firestore';
import { z } from 'zod';
import { useFirebase } from '../providers/FirebaseProvider';


const DocumentSchema = z.object({
    id: z.string(),
    name: z.string(),
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

type DocumentProps = z.infer<typeof DocumentSchema>;

const Document : React.FC<DocumentProps> = ({ id, name, content, createdAt, updatedAt }) => {
    const { db } = useFirebase();
    const { data: document, isLoading, error } = useQuery<DocumentProps>({
        queryKey: ['document', id],
        queryFn: async () => {
            const docRef = doc(db, 'documents', id);
            const snapshot = await getDoc(docRef);
            return snapshot.data() as DocumentProps;
          },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading document</div>;

    return (
        <div>
            <h1>Document</h1>
        </div>
    )
}

export default Document;