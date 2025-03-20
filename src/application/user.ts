import { Request, Response } from "express";
import { clerkClient } from '@clerk/clerk-sdk-node';
import User from "../infrastructure/schemas/user";

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    console.log("Recieved user",req.body)
    const { role, userId } = req.body;
    
    if (!userId || !role) {
      return res.status(400).json({ error: 'userId and role are required' });
    }
    
    // Get user details from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    
    // Update the user's public metadata in Clerk
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        role,
      },
    });
    
    // Find or create user in your database
    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // If user doesn't exist in your database, create them
      user = new User({
        clerkId: userId,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        profileImage: clerkUser.imageUrl,
        userImageUrl: clerkUser.imageUrl,
        role,
      });
    } else {
      // If user exists, update their role
      user.role = role;
    }
    
    // Save the user to your database
    await user.save();
    
    return res.status(200).json({ 
      success: true,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ error: 'Failed to update user role' });
  }
};