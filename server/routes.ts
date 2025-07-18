import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertMembershipRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Try to find user by username first, then by email
      let user = await storage.getUserByUsername(username);
      if (!user) {
        user = await storage.getUserByEmail(username);
      }
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if user has active membership
      const activeMembership = await storage.getActiveMembershipByUserId(user.id);
      const hasValidMembership = activeMembership && activeMembership.expiresAt > new Date();

      res.json({
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        hasValidMembership,
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      const existingEmail = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Membership routes
  app.post("/api/membership/request", async (req, res) => {
    try {
      const requestData = insertMembershipRequestSchema.parse(req.body);
      const membershipRequest = await storage.createMembershipRequest(requestData);
      res.json(membershipRequest);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.get("/api/membership/requests", async (req, res) => {
    try {
      const requests = await storage.getMembershipRequests();
      // Include user information with requests
      const requestsWithUsers = await Promise.all(
        requests.map(async (request) => {
          const user = await storage.getUser(request.userId);
          return {
            ...request,
            user: user ? {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            } : null,
          };
        })
      );
      res.json(requestsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch membership requests" });
    }
  });

  app.patch("/api/membership/requests/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = z.object({ status: z.enum(["approved", "rejected"]) }).parse(req.body);
      
      await storage.updateMembershipRequestStatus(id, status);
      res.json({ message: "Status updated successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.get("/api/membership/check/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const activeMembership = await storage.getActiveMembershipByUserId(userId);
      const hasValidMembership = activeMembership && activeMembership.expiresAt > new Date();
      
      res.json({
        hasValidMembership,
        membership: activeMembership,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to check membership" });
    }
  });

  // Content routes
  app.get("/api/slideshow", async (req, res) => {
    try {
      const images = await storage.getSlideshowImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch slideshow images" });
    }
  });

  app.get("/api/celebrities", async (req, res) => {
    try {
      const celebrities = await storage.getCelebrities();
      res.json(celebrities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch celebrities" });
    }
  });

  app.get("/api/celebrities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const celebrity = await storage.getCelebrityById(id);
      if (!celebrity) {
        return res.status(404).json({ message: "Celebrity not found" });
      }
      res.json(celebrity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch celebrity" });
    }
  });

  app.get("/api/albums", async (req, res) => {
    try {
      const featured = req.query.featured === "true";
      const albums = featured ? await storage.getFeaturedAlbums() : await storage.getAlbums();
      res.json(albums);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch albums" });
    }
  });

  app.get("/api/albums/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const album = await storage.getAlbumById(id);
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
      res.json(album);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch album" });
    }
  });

  app.get("/api/videos", async (req, res) => {
    try {
      const featured = req.query.featured === "true";
      const videos = featured ? await storage.getFeaturedVideos() : await storage.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideoById(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  // Admin routes
  app.post("/api/admin/celebrities", async (req, res) => {
    try {
      const celebrityData = req.body;
      const celebrity = await storage.createCelebrity(celebrityData);
      res.json(celebrity);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/admin/albums", async (req, res) => {
    try {
      const albumData = req.body;
      const album = await storage.createAlbum(albumData);
      res.json(album);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/admin/videos", async (req, res) => {
    try {
      const videoData = req.body;
      const video = await storage.createVideo(videoData);
      res.json(video);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/admin/slideshow", async (req, res) => {
    try {
      const imageData = req.body;
      const image = await storage.createSlideshowImage(imageData);
      res.json(image);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
