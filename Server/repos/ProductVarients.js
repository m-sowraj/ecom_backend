class ProductVarientRepository {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('ecom_ProductVarients');
    }

    static getCurrentISODate() {
        return new Date().toISOString();
      }
    // Create a new ProductVarient
    async createProductVarient(data) {
        // Set createdAt and updatedAt timestamps
        data.created_at = ProductVarientRepository.getCurrentISODate();
        data.updated_at = ProductVarientRepository.getCurrentISODate();
    
        // Create a batch for multiple operations
        const batch = this.db.batch();
    
        // Reference for the new ProductVarient document
        const ProductVarientRef = this.collection.doc(data.id); // Use data.id for document ID
        batch.set(ProductVarientRef, data); // Queue the set operation
    
        // Commit the batch
        await batch.commit();
    
        // Return the created ProductVarient data
        return { id: data.id, ...data };
    }
    
        
    // Get a ProductVarient by ID
    async getProductVarientById(id) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        } else {
            throw new Error('ProductVarient not found');
        }
    }

    // Get all ProductVarients by category ID with pagination
    async getAllProductVarients(query) {

            const limit = query.limit ? parseInt(query.limit) : 10; // Default limit
            const page = query.page ? parseInt(query.page) : 1; // Default page
            const ref = this.collection;
        
            // Create a base query
            let baseQuery = ref.limit(limit);
        
            // Filter by name if provided
            if (query.name) {
                baseQuery = baseQuery.where('name', '==', query.name);
            }

            // Filter by category if provided
            if (query.categoryId) {
                baseQuery = baseQuery.where('categoryId', '==', query.categoryId);
            }
        
            // Initialize an array for categories
            const categories = [];
            let snapshot;
        
            // Fetch documents for the current page
            try {
                snapshot = await baseQuery.get();
                snapshot.forEach((doc) => {
                    categories.push({ id: doc.id, ...doc.data() });
                });
            } catch (error) {
                console.error("Error fetching ProductVarients:", error);
                throw new Error('Error fetching ProductVarients');
            }
        
            // Pagination details
            const totalRecords = await this.getTotalRecords(query); // Function to count total records
            const totalPages = Math.ceil(totalRecords / limit);
            const currentPage = page;
        
            const pagination = { totalRecords, totalPages, currentPage, limit };
        
            return { categories, pagination };
        }
        

    // Function to count total ProductVarients by category
    async getTotalProductVarientsByCategory(categoryId) {
        const snapshot = await this.collection.where('categoryId', '==', categoryId).get();
        return snapshot.size; // Return the total number of records
    }

    // Update a ProductVarient by ID
    async updateProductVarient(id, data) {
        data.updatedAt = new Date();
        const docRef = this.collection.doc(id);
        await docRef.update(data);
        const updatedProductVarient = await docRef.get();
        return { id: updatedProductVarient.id, ...updatedProductVarient.data() };
    }

    // Delete a ProductVarient by ID
    async deleteProductVarient(id) {
        const docRef = this.collection.doc(id);
        await docRef.delete();
        return { id, message: 'ProductVarient deleted successfully' };
    }

    //getCategoryById
    async getCategoryById(id) {
        const docRef = this.db.collection('categories').doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        } else {
            throw new Error('Category not found');
        }
    }
}

module.exports = ProductVarientRepository;
