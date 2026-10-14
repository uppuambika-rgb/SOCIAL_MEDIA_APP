import { IUser, IPost, IComment, IFollow } from '../models/types';

export const INITIAL_USERS: IUser[] = [
  {
    id: 'user_nova',
    username: 'novaprime',
    handle: 'novaprime',
    displayName: 'Nova Rivera',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    bio: '⚡ Architecting decentralized neon interfaces & WebGL audio-reactive shaders. Night city resident.',
    location: 'Neo-Tokyo Sector 7',
    website: 'https://novaprime.design',
    badge: 'CREATOR',
    followersCount: 1420,
    followingCount: 380,
    postsCount: 14,
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'user_kairo',
    username: 'kairo_synth',
    handle: 'kairo_synth',
    displayName: 'Kairo Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    bio: 'Synthesizer purist, algorithmic beatmaker, and dark ambient sound designer. Exploring 140BPM cyberpunk grids.',
    location: 'Berlin Underpass',
    website: 'https://kairo.fm',
    badge: 'SYNTH_PRO',
    followersCount: 980,
    followingCount: 215,
    postsCount: 9,
    createdAt: '2026-02-01T14:30:00.000Z'
  },
  {
    id: 'user_lumina',
    username: 'lumina_ai',
    handle: 'lumina_ai',
    displayName: 'Lumina Zhang',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    bio: 'Holographic optics researcher & generative hardware tinker. Laser enthusiast with a penchant for neon violet.',
    location: 'Cyber Valley, Kyoto',
    website: 'https://lumina.lab',
    badge: 'CYBER_DEV',
    followersCount: 2310,
    followingCount: 450,
    postsCount: 22,
    createdAt: '2025-11-15T08:15:00.000Z'
  },
  {
    id: 'user_echo',
    username: 'echoblade',
    handle: 'echoblade',
    displayName: 'Echo Blade',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    bio: 'Speedrunning digital illusions. Low-poly 3D artist & glitch photographer. Neon is not just a color, it is an emotion.',
    location: 'Seattle Rain Sector',
    website: 'https://echo.art',
    badge: 'NEON_CORE',
    followersCount: 840,
    followingCount: 160,
    postsCount: 7,
    createdAt: '2026-03-05T19:00:00.000Z'
  }
];

export const INITIAL_POSTS: IPost[] = [
  {
    id: 'post_1',
    authorId: 'user_nova',
    content: 'Just deployed the new volumetric glassmorphism engine! Electric cyan borders with real-time blur passes are finally rendering at 120fps. What do you think of this midnight palette? #WebGLArt #NeonAesthetics #CyberUI',
    mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    tags: ['WebGLArt', 'NeonAesthetics', 'CyberUI'],
    likesCount: 142,
    likedBy: ['user_kairo', 'user_lumina'],
    commentsCount: 3,
    createdAt: '2026-10-14T09:20:00.000Z'
  },
  {
    id: 'post_2',
    authorId: 'user_kairo',
    content: 'Late night modular session in the underground bunker. Analog oscillators routed through an old tape delay, filtered with pulse modulation. The sub frequencies are shaking the studio monitors. Dropping a preview track shortly! 🎧⚡ #Synthwave #ModularSynth #NightVibes',
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    tags: ['Synthwave', 'ModularSynth', 'NightVibes'],
    likesCount: 89,
    likedBy: ['user_nova'],
    commentsCount: 2,
    createdAt: '2026-10-14T07:45:00.000Z'
  },
  {
    id: 'post_3',
    authorId: 'user_lumina',
    content: 'Discovered that optical diffraction gratings with high ultraviolet transmission create breathtaking violet chromatic aberrations when paired with pulsed lasers. The future of heads-up displays is luminously clear. 🔬✨ #QuantumOptics #NeonTech #FutureTech',
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    tags: ['QuantumOptics', 'NeonTech', 'FutureTech'],
    likesCount: 204,
    likedBy: ['user_nova', 'user_kairo', 'user_echo'],
    commentsCount: 4,
    createdAt: '2026-10-13T22:15:00.000Z'
  },
  {
    id: 'post_4',
    authorId: 'user_echo',
    content: 'Rain soaked streets reflect neon signs better than any digital render ever could. Captured this downtown during the midnight storm. The contrast between deep obsidian shadow and laser magenta is mesmerizing. #CyberCity #RainyNights #StreetPhotography',
    mediaUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    tags: ['CyberCity', 'RainyNights', 'StreetPhotography'],
    likesCount: 167,
    likedBy: ['user_lumina'],
    commentsCount: 1,
    createdAt: '2026-10-13T16:00:00.000Z'
  }
];

export const INITIAL_COMMENTS: IComment[] = [
  {
    id: 'comm_1',
    postId: 'post_1',
    authorId: 'user_lumina',
    content: 'The depth on those cyan fringes is pristine. Are you utilizing dual-pass Gaussian blur or compute shaders?',
    likesCount: 14,
    likedBy: ['user_nova'],
    createdAt: '2026-10-14T09:40:00.000Z'
  },
  {
    id: 'comm_2',
    postId: 'post_1',
    authorId: 'user_nova',
    content: 'Compute shaders with half-float precision buffers! It saves nearly 4ms on frame rendering.',
    likesCount: 8,
    likedBy: ['user_lumina'],
    createdAt: '2026-10-14T09:52:00.000Z'
  },
  {
    id: 'comm_3',
    postId: 'post_1',
    authorId: 'user_echo',
    content: 'That contrast against dark obsidian background is unmatched. Truly distinctive aesthetic!',
    likesCount: 5,
    likedBy: [],
    createdAt: '2026-10-14T10:15:00.000Z'
  },
  {
    id: 'comm_4',
    postId: 'post_2',
    authorId: 'user_nova',
    content: 'Send me the stems! Would love to code visual reactive geometries tuned to that bassline.',
    likesCount: 6,
    likedBy: ['user_kairo'],
    createdAt: '2026-10-14T08:10:00.000Z'
  },
  {
    id: 'comm_5',
    postId: 'post_2',
    authorId: 'user_echo',
    content: 'Tape saturation hits different at 3 AM.',
    likesCount: 4,
    likedBy: [],
    createdAt: '2026-10-14T08:35:00.000Z'
  },
  {
    id: 'comm_6',
    postId: 'post_3',
    authorId: 'user_nova',
    content: 'This will be incredible for AR smart visors. Beautiful chromatic fringing!',
    likesCount: 12,
    likedBy: ['user_lumina'],
    createdAt: '2026-10-13T23:05:00.000Z'
  }
];

export const INITIAL_FOLLOWS: IFollow[] = [
  { id: 'f_1', followerId: 'user_nova', followingId: 'user_lumina', createdAt: '2026-02-01T00:00:00.000Z' },
  { id: 'f_2', followerId: 'user_nova', followingId: 'user_kairo', createdAt: '2026-02-05T00:00:00.000Z' },
  { id: 'f_3', followerId: 'user_kairo', followingId: 'user_nova', createdAt: '2026-02-06T00:00:00.000Z' },
  { id: 'f_4', followerId: 'user_lumina', followingId: 'user_nova', createdAt: '2026-01-20T00:00:00.000Z' },
  { id: 'f_5', followerId: 'user_echo', followingId: 'user_nova', createdAt: '2026-03-01T00:00:00.000Z' }
];
