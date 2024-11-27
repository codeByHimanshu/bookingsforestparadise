import React, { useState, useEffect } from 'react';

const RoomQualities = () => {
    // Array of image URLs
    const images = [
        'https://plus.unsplash.com/premium_photo-1681487479203-464a22302b27?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1681487482484-52e5d3941319?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1681487228924-b9e640f1ca56?q=80&w=2066&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Effect to cycle through images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [images.length]);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>

            <p style={{ marginBottom: '30px', fontSize:'20px'}}>
                Experience luxurious comfort with our modern and spacious rooms, designed to provide a perfect blend of relaxation and elegance. All rooms feature:At Forest Paradise Resort, our rooms are designed to provide an unmatched blend of luxury, comfort, and style. Every detail has been thoughtfully considered to ensure that your stay with us is as memorable and rejuvenating as possible. Whether you’re visiting for relaxation, adventure, or a romantic getaway, our rooms offer the perfect sanctuary after a day of exploring the stunning landscapes of Ramnagar and the majestic Jim Corbett National Park.

                Each room features modern amenities and elegant interiors that reflect the tranquil beauty of the surrounding forest. With an emphasis on comfort and convenience, our rooms cater to the needs of both leisure and business travelers alike. From plush bedding to breathtaking views, we promise an experience that delights the senses.
            </p>
            <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '30px', fontFamily: 'cursive', fontSize: '20px' }}>
                <li>✔️ Air Conditioning</li>
                <li>✔️ Premium Bedding</li>
                <li>✔️ High-Speed WiFi</li>
                <li>✔️ 24/7 Room Service</li>
                <li>✔️ Scenic Views</li>
            </ul>
            <div style={{ position: 'relative', width: '600px', margin: '0 auto' }}>
                <img
                    src={images[currentImageIndex]}
                    alt="Room"
                    style={{
                        width: '100%',
                        height: '400px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        transition: 'opacity 1s ease-in-out',
                    }}
                />
            </div>
        </div>
    );
};

export default RoomQualities;
