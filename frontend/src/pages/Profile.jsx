import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import PromptCard from '../components/PromptCard';
import { CardSkeleton, Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';
import EditProfileModal from '../components/profile/EditProfileModal';
import FollowListModal from '../components/profile/FollowListModal';
import UserAvatar from '../components/ui/UserAvatar';
import EmptyState from '../components/ui/EmptyState';
import './Profile.css';

export default function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useContext(AuthContext);
    const { error: toastError } = useToast();
    const [profileUser, setProfileUser] = useState(null);
    const [prompts, setPrompts] = useState([]);
    const [savedPrompts, setSavedPrompts] = useState([]);
    const [activeTab, setActiveTab] = useState('prompts');
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [followModal, setFollowModal] = useState({ isOpen: false, title: '', users: [] });
    const { updateUser } = useContext(AuthContext);

    const userId = id || currentUser?._id || currentUser?.id;
    const { loading: authLoading } = useContext(AuthContext);

    useEffect(() => {
        const fetchProfile = async () => {
            if (authLoading) return;
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`/users/${userId}`);
                setProfileUser(response.data.user);
                setPrompts(response.data.prompts);
                if (currentUser) {
                    setIsFollowing(response.data.user.followers.includes(currentUser._id));
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                toastError('Error', 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        const fetchSavedPrompts = async () => {
            if (authLoading || !currentUser || userId !== currentUser?._id) return;
            try {
                const response = await axios.get('/users/saved');
                setSavedPrompts(response.data);
            } catch (error) {
                console.error('Error fetching saved prompts:', error);
            }
        };

        fetchProfile();
        fetchSavedPrompts();
    }, [userId, currentUser?._id, authLoading]);

    const handleFollow = async () => {
        if (!currentUser) return;
        try {
            const response = await axios.put(`/users/follow/${profileUser._id}`);
            setIsFollowing(response.data.isFollowing);
            setProfileUser({
                ...profileUser,
                followers: response.data.isFollowing
                    ? [...profileUser.followers, currentUser._id]
                    : profileUser.followers.filter(id => id.toString() !== currentUser._id.toString())
            });
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleMessage = () => {
        if (!currentUser || !profileUser) return;
        navigate('/messages', { state: { selectedUser: profileUser } });
    };

    const handleFollowClick = async (type) => {
        try {
            const response = await axios.get(`/users/${profileUser._id}/${type}`);
            setFollowModal({
                isOpen: true,
                title: type === 'followers' ? 'Followers' : 'Following',
                users: response.data
            });
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="profile-container">
                <div className="profile-header">
                    <Skeleton className="profile-avatar-large" />
                    <div className="profile-info">
                        <Skeleton style={{ width: '200px', height: '2rem', marginBottom: '1rem' }} />
                        <Skeleton style={{ width: '300px', height: '1rem' }} />
                    </div>
                </div>
                <div className="prompts-grid">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </div>
        );
    }

    if (!profileUser) {
        return (
            <div className="profile-container">
                <h2>User not found</h2>
            </div>
        );
    }

    const isOwnProfile = currentUser && (currentUser?._id === profileUser?._id || currentUser?.id === profileUser?._id);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <UserAvatar
                    user={profileUser}
                    size="120px"
                    className="profile-avatar-large"
                    style={{ border: '4px solid #ffffff' }}
                />

                <div className="profile-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ marginBottom: '0.25rem' }}>{profileUser.username}</h1>
                            <p style={{ color: '#666', marginBottom: '1rem' }}>{profileUser.bio || 'No bio yet'}</p>
                        </div>
                        {!isOwnProfile && currentUser && (
                            <div className="profile-actions">
                                <button
                                    className={`follow-btn ${isFollowing ? 'outline' : ''}`}
                                    onClick={handleFollow}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                                <button className="message-btn" onClick={handleMessage}>Message</button>
                            </div>
                        )}
                        {isOwnProfile && (
                            <div className="profile-actions">
                                <button
                                    className="follow-btn outline"
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-value">{prompts.length}</span>
                            <span className="stat-label">Prompts</span>
                        </div>
                        <div className="stat-item" onClick={() => handleFollowClick('followers')} style={{ cursor: 'pointer' }}>
                            <span className="stat-value">{profileUser.followers.length}</span>
                            <span className="stat-label">Followers</span>
                        </div>
                        <div className="stat-item" onClick={() => handleFollowClick('following')} style={{ cursor: 'pointer' }}>
                            <span className="stat-value">{profileUser.following.length}</span>
                            <span className="stat-label">Following</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-tabs">
                <button
                    className={`profile-tab ${activeTab === 'prompts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('prompts')}
                >
                    Prompts
                </button>
                {isOwnProfile && (
                    <button
                        className={`profile-tab ${activeTab === 'saved' ? 'active' : ''}`}
                        onClick={() => setActiveTab('saved')}
                    >
                        Saved
                    </button>
                )}
            </div>

            <div className="prompts-grid">
                {activeTab === 'prompts' ? (
                    prompts.length > 0 ? (
                        prompts.map(prompt => (
                            <PromptCard key={prompt._id} prompt={{ ...prompt, author: profileUser }} />
                        ))
                    ) : (
                        <EmptyState
                            icon="FolderOpen"
                            title="No Prompts Yet"
                            description={isOwnProfile ? "You haven't posted any prompts yet. Start sharing your creativity!" : "This user hasn't posted any prompts yet."}
                            actionLink={isOwnProfile ? '/create' : null}
                            actionText="Create Prompt"
                        />
                    )
                ) : (
                    savedPrompts.length > 0 ? (
                        savedPrompts.map(prompt => (
                            <PromptCard key={prompt._id} prompt={prompt} />
                        ))
                    ) : (
                        <EmptyState
                            icon="FolderOpen"
                            title="No Saved Prompts"
                            description="You haven't saved any prompts yet. Explore the feed to find inspiration."
                            actionLink="/"
                            actionText="Explore Feed"
                        />
                    )
                )}
            </div>

            {isEditModalOpen && (
                <EditProfileModal
                    user={profileUser}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={(updatedUser) => {
                        setProfileUser(updatedUser);
                        updateUser(updatedUser);
                    }}
                />
            )}

            {followModal.isOpen && (
                <FollowListModal
                    title={followModal.title}
                    users={followModal.users}
                    onClose={() => setFollowModal({ ...followModal, isOpen: false })}
                />
            )}
        </div>
    );
}
