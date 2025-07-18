import { 
  users, 
  membershipRequests, 
  activeMemberships, 
  celebrities, 
  albums, 
  videos, 
  slideshowImages,
  type User, 
  type InsertUser,
  type MembershipRequest,
  type InsertMembershipRequest,
  type ActiveMembership,
  type Celebrity,
  type InsertCelebrity,
  type Album,
  type InsertAlbum,
  type Video,
  type InsertVideo,
  type SlideshowImage,
  type InsertSlideshowImage,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Membership operations
  createMembershipRequest(request: InsertMembershipRequest): Promise<MembershipRequest>;
  getMembershipRequests(): Promise<MembershipRequest[]>;
  getMembershipRequestById(id: number): Promise<MembershipRequest | undefined>;
  updateMembershipRequestStatus(id: number, status: string): Promise<void>;
  
  // Active membership operations
  getActiveMembershipByUserId(userId: number): Promise<ActiveMembership | undefined>;
  createActiveMembership(membership: { userId: number; plan: string; expiresAt: Date }): Promise<ActiveMembership>;
  
  // Celebrity operations
  getCelebrities(): Promise<Celebrity[]>;
  getCelebrityById(id: number): Promise<Celebrity | undefined>;
  createCelebrity(celebrity: InsertCelebrity): Promise<Celebrity>;
  
  // Album operations
  getAlbums(): Promise<Album[]>;
  getFeaturedAlbums(): Promise<Album[]>;
  getAlbumById(id: number): Promise<Album | undefined>;
  createAlbum(album: InsertAlbum): Promise<Album>;
  
  // Video operations
  getVideos(): Promise<Video[]>;
  getFeaturedVideos(): Promise<Video[]>;
  getVideoById(id: number): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  
  // Slideshow operations
  getSlideshowImages(): Promise<SlideshowImage[]>;
  createSlideshowImage(image: InsertSlideshowImage): Promise<SlideshowImage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private membershipRequests: Map<number, MembershipRequest>;
  private activeMemberships: Map<number, ActiveMembership>;
  private celebrities: Map<number, Celebrity>;
  private albums: Map<number, Album>;
  private videos: Map<number, Video>;
  private slideshowImages: Map<number, SlideshowImage>;
  private currentUserId: number;
  private currentRequestId: number;
  private currentMembershipId: number;
  private currentCelebrityId: number;
  private currentAlbumId: number;
  private currentVideoId: number;
  private currentSlideshowId: number;

  constructor() {
    this.users = new Map();
    this.membershipRequests = new Map();
    this.activeMemberships = new Map();
    this.celebrities = new Map();
    this.albums = new Map();
    this.videos = new Map();
    this.slideshowImages = new Map();
    this.currentUserId = 1;
    this.currentRequestId = 1;
    this.currentMembershipId = 1;
    this.currentCelebrityId = 1;
    this.currentAlbumId = 1;
    this.currentVideoId = 1;
    this.currentSlideshowId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    const adminUser: User = {
      id: this.currentUserId++,
      username: "sohaghasunbd@gmail.com",
      password: "sohagq301",
      firstName: "Admin",
      lastName: "User",
      email: "sohaghasunbd@gmail.com",
      dateOfBirth: "1990-01-01",
      contactNumber: "+1234567890",
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Initialize sample celebrities
    const sampleCelebrities: Celebrity[] = [
      {
        id: this.currentCelebrityId++,
        name: "Sarah Johnson",
        profession: "Model & Influencer",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
        description: "Professional model and social media influencer",
        isFree: false,
        price: "25.00",
        createdAt: new Date(),
      },
      {
        id: this.currentCelebrityId++,
        name: "Emma Davis",
        profession: "Fashion Model",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        description: "International fashion model",
        isFree: false,
        price: "30.00",
        createdAt: new Date(),
      },
      {
        id: this.currentCelebrityId++,
        name: "Lisa Chen",
        profession: "Celebrity",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        description: "Celebrity and entertainment personality",
        isFree: false,
        price: "35.00",
        createdAt: new Date(),
      },
      {
        id: this.currentCelebrityId++,
        name: "Maya Rodriguez",
        profession: "Influencer",
        imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=400&h=400&fit=crop",
        description: "Social media influencer and content creator",
        isFree: false,
        price: "20.00",
        createdAt: new Date(),
      },
    ];
    sampleCelebrities.forEach(celebrity => this.celebrities.set(celebrity.id, celebrity));

    // Initialize sample albums
    const sampleAlbums: Album[] = [
      {
        id: this.currentAlbumId++,
        title: "Glamour Collection",
        description: "Exclusive high-fashion photography collection with 25+ premium images",
        imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop",
        price: "15.00",
        imageCount: 25,
        isFeatured: true,
        createdAt: new Date(),
      },
      {
        id: this.currentAlbumId++,
        title: "Portrait Masters",
        description: "Professional portrait collection featuring top models and celebrities",
        imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=400&fit=crop",
        price: "20.00",
        imageCount: 30,
        isFeatured: true,
        createdAt: new Date(),
      },
      {
        id: this.currentAlbumId++,
        title: "Lifestyle Luxury",
        description: "Premium lifestyle photography capturing authentic moments and beauty",
        imageUrl: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&h=400&fit=crop",
        price: "25.00",
        imageCount: 35,
        isFeatured: true,
        createdAt: new Date(),
      },
    ];
    sampleAlbums.forEach(album => this.albums.set(album.id, album));

    // Initialize sample videos
    const sampleVideos: Video[] = [
      {
        id: this.currentVideoId++,
        title: "Behind the Scenes",
        description: "Exclusive behind-the-scenes footage from premium photo shoots",
        thumbnailUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop",
        videoUrl: "https://example.com/video1.mp4",
        price: "30.00",
        duration: "15:30",
        isFeatured: true,
        createdAt: new Date(),
      },
      {
        id: this.currentVideoId++,
        title: "Studio Sessions",
        description: "Professional studio sessions with top models and celebrities",
        thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
        videoUrl: "https://example.com/video2.mp4",
        price: "35.00",
        duration: "22:15",
        isFeatured: true,
        createdAt: new Date(),
      },
      {
        id: this.currentVideoId++,
        title: "Fashion Shows",
        description: "Exclusive coverage of high-fashion runway shows and events",
        thumbnailUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop",
        videoUrl: "https://example.com/video3.mp4",
        price: "40.00",
        duration: "28:45",
        isFeatured: true,
        createdAt: new Date(),
      },
    ];
    sampleVideos.forEach(video => this.videos.set(video.id, video));

    // Initialize slideshow images
    const sampleSlideshowImages: SlideshowImage[] = [
      {
        id: this.currentSlideshowId++,
        imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&h=800&fit=crop",
        title: "Premium Content Awaits",
        subtitle: "Exclusive access to high-quality digital content",
        order: 1,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentSlideshowId++,
        imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=800&fit=crop",
        title: "Luxury Experience",
        subtitle: "Discover premium content like never before",
        order: 2,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentSlideshowId++,
        imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=800&fit=crop",
        title: "Digital Excellence",
        subtitle: "Where technology meets premium content",
        order: 3,
        isActive: true,
        createdAt: new Date(),
      },
    ];
    sampleSlideshowImages.forEach(image => this.slideshowImages.set(image.id, image));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      role: "user",
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Membership operations
  async createMembershipRequest(insertRequest: InsertMembershipRequest): Promise<MembershipRequest> {
    const request: MembershipRequest = {
      ...insertRequest,
      id: this.currentRequestId++,
      status: "pending",
      createdAt: new Date(),
      approvedAt: null,
    };
    this.membershipRequests.set(request.id, request);
    return request;
  }

  async getMembershipRequests(): Promise<MembershipRequest[]> {
    return Array.from(this.membershipRequests.values());
  }

  async getMembershipRequestById(id: number): Promise<MembershipRequest | undefined> {
    return this.membershipRequests.get(id);
  }

  async updateMembershipRequestStatus(id: number, status: string): Promise<void> {
    const request = this.membershipRequests.get(id);
    if (request) {
      request.status = status;
      if (status === "approved") {
        request.approvedAt = new Date();
        // Create active membership
        const expiresAt = new Date();
        switch (request.plan) {
          case "3-days":
            expiresAt.setDate(expiresAt.getDate() + 3);
            break;
          case "15-days":
            expiresAt.setDate(expiresAt.getDate() + 15);
            break;
          case "30-days":
            expiresAt.setDate(expiresAt.getDate() + 30);
            break;
        }
        await this.createActiveMembership({
          userId: request.userId,
          plan: request.plan,
          expiresAt,
        });
      }
    }
  }

  // Active membership operations
  async getActiveMembershipByUserId(userId: number): Promise<ActiveMembership | undefined> {
    return Array.from(this.activeMemberships.values()).find(
      membership => membership.userId === userId && membership.expiresAt > new Date()
    );
  }

  async createActiveMembership(membership: { userId: number; plan: string; expiresAt: Date }): Promise<ActiveMembership> {
    const activeMembership: ActiveMembership = {
      ...membership,
      id: this.currentMembershipId++,
      createdAt: new Date(),
    };
    this.activeMemberships.set(activeMembership.id, activeMembership);
    return activeMembership;
  }

  // Celebrity operations
  async getCelebrities(): Promise<Celebrity[]> {
    return Array.from(this.celebrities.values());
  }

  async getCelebrityById(id: number): Promise<Celebrity | undefined> {
    return this.celebrities.get(id);
  }

  async createCelebrity(insertCelebrity: InsertCelebrity): Promise<Celebrity> {
    const celebrity: Celebrity = {
      ...insertCelebrity,
      id: this.currentCelebrityId++,
      createdAt: new Date(),
    };
    this.celebrities.set(celebrity.id, celebrity);
    return celebrity;
  }

  // Album operations
  async getAlbums(): Promise<Album[]> {
    return Array.from(this.albums.values());
  }

  async getFeaturedAlbums(): Promise<Album[]> {
    return Array.from(this.albums.values()).filter(album => album.isFeatured);
  }

  async getAlbumById(id: number): Promise<Album | undefined> {
    return this.albums.get(id);
  }

  async createAlbum(insertAlbum: InsertAlbum): Promise<Album> {
    const album: Album = {
      ...insertAlbum,
      id: this.currentAlbumId++,
      createdAt: new Date(),
    };
    this.albums.set(album.id, album);
    return album;
  }

  // Video operations
  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }

  async getFeaturedVideos(): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(video => video.isFeatured);
  }

  async getVideoById(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const video: Video = {
      ...insertVideo,
      id: this.currentVideoId++,
      createdAt: new Date(),
    };
    this.videos.set(video.id, video);
    return video;
  }

  // Slideshow operations
  async getSlideshowImages(): Promise<SlideshowImage[]> {
    return Array.from(this.slideshowImages.values())
      .filter(image => image.isActive)
      .sort((a, b) => a.order - b.order);
  }

  async createSlideshowImage(insertImage: InsertSlideshowImage): Promise<SlideshowImage> {
    const image: SlideshowImage = {
      ...insertImage,
      id: this.currentSlideshowId++,
      createdAt: new Date(),
    };
    this.slideshowImages.set(image.id, image);
    return image;
  }
}

export const storage = new MemStorage();
