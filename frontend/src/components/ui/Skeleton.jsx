import './Skeleton.css';

export const Skeleton = ({ type = 'text', width, height, className = '' }) => {
    const style = {};
    if (width) style.width = width;
    if (height) style.height = height;

    return (
        <div
            className={`skeleton ${type} ${className}`}
            style={style}
        />
    );
}

export const CardSkeleton = () => (
    <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Skeleton type="circle" />
            <div style={{ flex: 1 }}>
                <Skeleton type="text" width="40%" />
                <Skeleton type="text" width="20%" />
            </div>
        </div>
        <Skeleton type="text" height="1.5rem" width="80%" />
        <Skeleton type="text" height="6rem" />
        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
            <Skeleton type="text" width="60px" />
            <Skeleton type="text" width="60px" />
        </div>
    </div>
);
