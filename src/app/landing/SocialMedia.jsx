import React from 'react';

function SocialMedia() {
    const posts = [
        {
            image: 'https://i.pinimg.com/1200x/1e/2c/b3/1e2cb3c3a59175a8e8985c8fe51e36e3.jpg',
            name: 'Sophia Turner',
            handle: '@sophiahomes',
            profilePic: 'https://img.freepik.com/free-photo/smiley-black-teenage-girl-relaxing-outdoors_23-2149012772.jpg?semt=ais_hybrid&w=740&q=80',
            content: "I just gave my living room a complete makeover with their furniture! The cozy sofa and stylish coffee table make it feel like a magazine spread 😍. My guests keep complimenting the space!",
            timestamp: '2:30 PM · Jan 5, 2026'
        },
        {
            image: 'https://i.pinimg.com/1200x/fb/9d/9d/fb9d9d97ecdd55eaa0565dd9314afb64.jpg',
            name: 'Lara Rodriguez',
            handle: '@laradecor',
            profilePic: 'https://img.freepik.com/free-photo/young-beautiful-girl-posing-black-leather-jacket-park_1153-8104.jpg?semt=ais_hybrid&w=740&q=80 ',
            content: "Transformed my bedroom into a serene retreat! The bed frame and side tables are sleek yet super comfy. Waking up here is pure joy 🌿 #bedroomgoals",
            timestamp: '11:10 AM · Jan 4, 2026'
        },
        {
            image: ' https://i.pinimg.com/736x/e1/83/4c/e1834c11c495646e00149ed69db87275.jpg',
            name: 'Liam Williams',
            handle: '@Liam.kitchen',
            profilePic: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
            content: "Finally refreshed my kitchen! The dining set fits perfectly and the cabinets feel premium. Cooking and entertaining have never been this enjoyable 🍽️✨",
            timestamp: '6:45 PM · Jan 3, 2026'
        },
    ];

    const PostCard = ({ post }) => (
        <div className="w-full md:w-1/3 p-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <img src={post.profilePic} alt={post.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-1">
                                <p className="font-bold text-gray-900 truncate">{post.name}</p>
                                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
                                </svg>
                            </div>
                            <span className="text-xs text-gray-500">{post.handle}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <p className="text-gray-900 text-sm leading-relaxed mb-3">{post.content}</p>

                {/* Image */}
                <div className="rounded-xl overflow-hidden border border-gray-200 mb-3">
                    <img src={post.image} alt="" className="w-full h-48 object-cover" />
                </div>

                {/* Timestamp */}
                <div className="text-gray-500 text-xs">{post.timestamp}</div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto flex flex-wrap">
            {posts.map((post, index) => (
                <PostCard key={index} post={post} />
            ))}
        </div>
    );
}

export default SocialMedia;
