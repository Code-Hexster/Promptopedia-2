import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import './CreatePrompt.css';

export default function CreatePrompt() {
    const navigate = useNavigate();
    const location = useLocation();
    const { success, error: toastError } = useToast();
    const [title, setTitle] = useState('');
    const [modelUsed, setModelUsed] = useState('GPT-4');
    const [promptText, setPromptText] = useState('');
    const [outputImage, setOutputImage] = useState('');
    const [outputText, setOutputText] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.remixPrompt) {
            const { title: remixTitle, promptText: remixText, modelUsed: remixModel, tags: remixTags } = location.state.remixPrompt;
            setTitle(`Remix: ${remixTitle || ''}`);
            setPromptText(remixText || '');
            setModelUsed(remixModel || 'GPT-4');
            setTags(remixTags || []);
            // Clear state to prevent infinite remix loops on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleTagKeyDown = (event) => {
        if ((event.key === 'Enter' || event.key === ',') && tagInput.trim()) {
            event.preventDefault();
            const cleanTag = tagInput.replace(/,/g, '').trim();
            if (cleanTag && !tags.includes(cleanTag)) {
                setTags([...tags, cleanTag]);
            }
            setTagInput('');
        }
    };

    const handleTagBlur = () => {
        if (tagInput.trim()) {
            const cleanTag = tagInput.replace(/,/g, '').trim();
            if (cleanTag && !tags.includes(cleanTag)) {
                setTags([...tags, cleanTag]);
            }
            setTagInput('');
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            await axios.post('/prompts/create', {
                title,
                modelUsed,
                promptText,
                outputImage,
                outputText,
                tags
            });
            success('Success', 'Prompt published successfully!');
            navigate('/');
        } catch (error) {
            toastError('Error', error.response?.data?.message || 'Failed to create prompt');
            setLoading(false);
        }
    };

    return (
        <div className="create-prompt-container">
            <div className="create-prompt-card">
                <div className="create-prompt-header">
                    <h1>Create Post</h1>
                    <p>Share your best prompts with the community</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="E.g., Cyberpunk City Generator"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Model Used</label>
                            <select
                                className="form-input"
                                value={modelUsed}
                                onChange={(e) => setModelUsed(e.target.value)}
                            >
                                <option value="GPT-4">GPT-4</option>
                                <option value="GPT-3.5">GPT-3.5</option>
                                <option value="Midjourney">Midjourney</option>
                                <option value="DALL-E 3">DALL-E 3</option>
                                <option value="Stable Diffusion">Stable Diffusion</option>
                                <option value="Claude 3">Claude 3</option>
                                <option value="Llama 3">Llama 3</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tags</label>
                            <div className="tags-input-container">
                                {tags.map((tag, index) => (
                                    <div key={index} className="tag-chip">
                                        <span>#{tag}</span>
                                        <button type="button" onClick={() => removeTag(index)}>×</button>
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    className="tags-input"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    onBlur={handleTagBlur}
                                    placeholder="Add tag + Enter or Comma"
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Prompt</label>
                            <textarea
                                className="form-input form-textarea"
                                value={promptText}
                                onChange={(e) => setPromptText(e.target.value)}
                                placeholder="Paste your prompt here..."
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Output Text (Optional)</label>
                            <textarea
                                className="form-input form-textarea"
                                value={outputText}
                                onChange={(e) => setOutputText(e.target.value)}
                                placeholder="Paste the text output result here..."
                                style={{ minHeight: '80px' }}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Output Image URL (Optional)</label>
                            <input
                                type="url"
                                className="form-input"
                                value={outputImage}
                                onChange={(e) => setOutputImage(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        loading={loading}
                        style={{ marginTop: '2rem', width: '100%' }}
                    >
                        Publish Prompt
                    </Button>
                </form>
            </div>
        </div>
    );
}
