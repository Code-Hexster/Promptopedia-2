import { useState, useEffect } from 'react';
import axios from '../api/axios';
import PromptCard from '../components/PromptCard';
import { Search } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

export default function Home() {
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const { error: toastError } = useToast();

    useEffect(() => {
        fetchPrompts();
    }, []);

    const fetchPrompts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/prompts/feed');
            setPrompts(response.data);
        } catch (error) {
            toastError('Error', 'Failed to fetch feed');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchPrompts();
            return;
        }

        setLoading(true);
        setIsSearching(true);
        try {
            const response = await axios.get(`/prompts/search/tags?query=${searchQuery}`);
            setPrompts(response.data);
        } catch (error) {
            toastError('Error', 'Failed to search prompts');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
        fetchPrompts();
    };

    if (loading) {
        return (
            <div className="feed-container">
                <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Recent Prompts</h1>
                <div style={{ marginBottom: '2rem', height: '42px', backgroundColor: '#f3f4f6', borderRadius: '99px' }}></div>
                <div className="prompts-grid">
                    {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
                </div>
            </div>
        );
    }



    return (
        <div className="feed-container">
            <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Recent Prompts</h1>

            <form onSubmit={handleSearch} style={{ marginBottom: '2.5rem', display: 'flex', gap: '0.75rem', alignItems: 'stretch' }}>
                <div style={{
                    position: 'relative',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    focusWithin: { borderColor: '#1a1a1a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
                }}
                    className="search-container"
                >
                    <Search style={{ marginLeft: '1.25rem', color: '#6b7280', flexShrink: 0 }} size={20} />
                    <input
                        type="text"
                        placeholder="Search prompts by tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={(e) => {
                            const container = e.target.parentElement;
                            container.style.borderColor = '#1a1a1a';
                            container.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                        }}
                        onBlur={(e) => {
                            const container = e.target.parentElement;
                            container.style.borderColor = '#e5e7eb';
                            container.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                        }}
                        style={{
                            flex: 1,
                            padding: '0.9rem 1rem',
                            border: 'none',
                            fontSize: '1rem',
                            outline: 'none',
                            backgroundColor: 'transparent',
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '0 2rem',
                        backgroundColor: '#1a1a1a',
                        color: 'white',
                        borderRadius: '16px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#1a1a1a'}
                >
                    Search
                </button>
                {isSearching && (
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        style={{
                            padding: '0 1.5rem',
                            backgroundColor: 'white',
                            color: '#1f2937',
                            borderRadius: '16px',
                            border: '1px solid #e5e7eb',
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                        Clear
                    </button>
                )}
            </form>

            {prompts.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>{isSearching ? 'No prompts found matching your search.' : 'No prompts found. Be the first to create one!'}</p>
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
