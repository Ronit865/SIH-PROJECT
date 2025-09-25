import fs from 'fs';
import csv from 'csv-parser';

export const parseCsv = (filePath) => {
    return new Promise((resolve, reject) => {
        const userPromises = []; // Store promises instead of users
        
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Create a promise for each row processing
                const userPromise = processRow(row);
                userPromises.push(userPromise);
            })
            .on('end', async () => {
                try {
                    // Wait for all async operations to complete
                    const processedUsers = await Promise.all(userPromises);
                    
                    // Filter out null/undefined users (validation failures)
                    const validUsers = processedUsers.filter(user => user !== null);
                    
                    // Clean up - delete the uploaded file
                    fs.unlink(filePath, (err) => {
                        if (err) console.error('Error deleting file:', err);
                    });
                    
                    console.log(`Parsed ${validUsers.length} users from CSV`);
                    resolve(validUsers);
                } catch (error) {
                    // Clean up on error
                    fs.unlink(filePath, (err) => {
                        if (err) console.error('Error deleting file:', err);
                    });
                    reject(error);
                }
            })
            .on('error', (error) => {
                // Clean up - delete the uploaded file
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
                reject(error);
            });
    });
};

// Helper function to process each row
const processRow = async (row) => {
    try {
        // Map your CSV columns to match your actual CSV structure
        const user = {
            name: row.name,
            email: row.email,
            password: row.password || 'defaultPassword123',
            role: row.role || 'student',
            avatar: row.avatar || '',
            graduationYear: row.graduationYear || null,
            course: row.course || row.course,
            currentPosition: row.currentPosition,
            company: row.company,
            location: row.location,
            phone: row.phone,
            bio: row.bio,
            linkedin: row.linkedin,
            github: row.github,
            isVerified: row.isVerified === 'TRUE' || row.isVerified === true,
            // Don't include refreshToken from CSV - let it be generated
        };

        // Validate required fields
        if (!user.name || !user.email) {
            console.warn(`Skipping row due to missing required fields:`, row);
            return null;
        }

      
        return user;
    } catch (error) {
        console.error('Error processing row:', row, error);
        return null;
    }
};