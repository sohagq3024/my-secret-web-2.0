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
import { db } from "./db";
import { eq } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Check if admin user already exists
      const adminUser = await this.getUserByUsername("sohaghasunbd@gmail.com");
      if (!adminUser) {
        // Create admin user
        await db.insert(users).values({
          username: "sohaghasunbd@gmail.com",
          password: "sohagq301",
          firstName: "Admin",
          lastName: "User",
          email: "sohaghasunbd@gmail.com",
          dateOfBirth: "1990-01-01",
          contactNumber: "+1234567890",
          role: "admin",
        });

        // Initialize sample data only if it doesn't exist
        const existingCelebrities = await db.select().from(celebrities);
        if (existingCelebrities.length === 0) {
          // Initialize sample celebrities
          await db.insert(celebrities).values([
            {
              name: "Sarah Johnson",
              profession: "Model & Influencer",
              imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
              description: "Professional model and social media influencer",
              isFree: false,
              price: "25.00",
            },
            {
              name: "Emma Davis",
              profession: "Fashion Model",
              imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
              description: "International fashion model",
              isFree: false,
              price: "30.00",
            },
            {
              name: "Lisa Chen",
              profession: "Celebrity",
              imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
              description: "Celebrity and entertainment personality",
              isFree: false,
              price: "35.00",
            },
            {
              name: "Maya Rodriguez",
              profession: "Influencer",
              imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=400&h=400&fit=crop",
              description: "Social media influencer and content creator",
              isFree: false,
              price: "20.00",
            },
          ]);

          // Initialize sample albums
          await db.insert(albums).values([
            {
              title: "Glamour Collection",
              description: "Exclusive high-fashion photography collection with 25+ premium images",
              imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop",
              price: "15.00",
              imageCount: 25,
              isFeatured: true,
            },
            {
              title: "Portrait Masters",
              description: "Professional portrait collection featuring top models and celebrities",
              imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=400&fit=crop",
              price: "20.00",
              imageCount: 30,
              isFeatured: true,
            },
            {
              title: "Lifestyle Luxury",
              description: "Premium lifestyle photography capturing authentic moments and beauty",
              imageUrl: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&h=400&fit=crop",
              price: "25.00",
              imageCount: 35,
              isFeatured: true,
            },
          ]);

          // Initialize sample videos
          await db.insert(videos).values([
            {
              title: "Behind the Scenes",
              description: "Exclusive behind-the-scenes footage from premium photo shoots",
              thumbnailUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop",
              videoUrl: "https://example.com/video1.mp4",
              price: "30.00",
              duration: "15:30",
              isFeatured: true,
            },
            {
              title: "Studio Sessions",
              description: "Professional studio sessions with top models and celebrities",
              thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
              videoUrl: "https://example.com/video2.mp4",
              price: "35.00",
              duration: "22:15",
              isFeatured: true,
            },
            {
              title: "Fashion Shows",
              description: "Exclusive coverage of high-fashion runway shows and events",
              thumbnailUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop",
              videoUrl: "https://example.com/video3.mp4",
              price: "40.00",
              duration: "28:45",
              isFeatured: true,
            },
          ]);

          // Initialize slideshow images
          await db.insert(slideshowImages).values([
            {
              imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&h=800&fit=crop",
              title: "Premium Content Awaits",
              subtitle: "Exclusive access to high-quality digital content",
              order: 1,
              isActive: true,
            },
            {
              imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=800&fit=crop",
              title: "Luxury Experience",
              subtitle: "Discover premium content like never before",
              order: 2,
              isActive: true,
            },
            {
              imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=800&fit=crop",
              title: "Digital Excellence",
              subtitle: "Where technology meets premium content",
              order: 3,
              isActive: true,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      role: "user",
    }).returning();
    return user;
  }

  // Membership operations
  async createMembershipRequest(insertRequest: InsertMembershipRequest): Promise<MembershipRequest> {
    const [request] = await db.insert(membershipRequests).values({
      ...insertRequest,
      status: "pending",
    }).returning();
    return request;
  }

  async getMembershipRequests(): Promise<MembershipRequest[]> {
    return await db.select().from(membershipRequests);
  }

  async getMembershipRequestById(id: number): Promise<MembershipRequest | undefined> {
    const [request] = await db.select().from(membershipRequests).where(eq(membershipRequests.id, id));
    return request || undefined;
  }

  async updateMembershipRequestStatus(id: number, status: string): Promise<void> {
    const updateData: any = { status };
    if (status === "approved") {
      updateData.approvedAt = new Date();
    }
    
    await db.update(membershipRequests)
      .set(updateData)
      .where(eq(membershipRequests.id, id));

    if (status === "approved") {
      const request = await this.getMembershipRequestById(id);
      if (request) {
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
    const [membership] = await db.select().from(activeMemberships)
      .where(eq(activeMemberships.userId, userId));
    
    if (membership && membership.expiresAt > new Date()) {
      return membership;
    }
    return undefined;
  }

  async createActiveMembership(membership: { userId: number; plan: string; expiresAt: Date }): Promise<ActiveMembership> {
    const [activeMembership] = await db.insert(activeMemberships).values(membership).returning();
    return activeMembership;
  }

  // Celebrity operations
  async getCelebrities(): Promise<Celebrity[]> {
    return await db.select().from(celebrities);
  }

  async getCelebrityById(id: number): Promise<Celebrity | undefined> {
    const [celebrity] = await db.select().from(celebrities).where(eq(celebrities.id, id));
    return celebrity || undefined;
  }

  async createCelebrity(insertCelebrity: InsertCelebrity): Promise<Celebrity> {
    const [celebrity] = await db.insert(celebrities).values(insertCelebrity).returning();
    return celebrity;
  }

  // Album operations
  async getAlbums(): Promise<Album[]> {
    return await db.select().from(albums);
  }

  async getFeaturedAlbums(): Promise<Album[]> {
    return await db.select().from(albums).where(eq(albums.isFeatured, true));
  }

  async getAlbumById(id: number): Promise<Album | undefined> {
    const [album] = await db.select().from(albums).where(eq(albums.id, id));
    return album || undefined;
  }

  async createAlbum(insertAlbum: InsertAlbum): Promise<Album> {
    const [album] = await db.insert(albums).values(insertAlbum).returning();
    return album;
  }

  // Video operations
  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos);
  }

  async getFeaturedVideos(): Promise<Video[]> {
    return await db.select().from(videos).where(eq(videos.isFeatured, true));
  }

  async getVideoById(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const [video] = await db.insert(videos).values(insertVideo).returning();
    return video;
  }

  // Slideshow operations
  async getSlideshowImages(): Promise<SlideshowImage[]> {
    return await db.select().from(slideshowImages)
      .where(eq(slideshowImages.isActive, true))
      .orderBy(slideshowImages.order);
  }

  async createSlideshowImage(insertImage: InsertSlideshowImage): Promise<SlideshowImage> {
    const [image] = await db.insert(slideshowImages).values(insertImage).returning();
    return image;
  }
}

export const storage = new DatabaseStorage();
