import { useState, useEffect } from 'react';
import axios from '../api/axios';
import PromptCard from '../components/PromptCard';
import { Loader2 } from 'lucide-react';

export default function Following() {
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFollowingPrompts = async () => {
            try {
                const response = await axios.get('/prompts/following');
                setPrompts(response.data);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch following feed');
            } finally {
                setLoading(false);
            }
        };

        fetchFollowingPrompts();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
    }

    return (
        <div className="feed-container">
            <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Following Feed</h1>

            {prompts.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>
                    No prompts from people you follow yet.
                    <br />
                    Follow some users to see their posts here!
                </p>
            ) : (
                <div className="prompts-grid">
                    {prompts.map((prompt) => (
                        <PromptCard key={prompt._id} prompt={prompt} />
                    ))}
                </div>
            )}
        </div>
    );
}
