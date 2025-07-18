// Initialize Supabase client
const supabaseUrl = 'https://hdaopilclxzrlobomczz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkYW9waWxjbHh6cmxvYm9tY3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDg0MzMsImV4cCI6MjA2ODM4NDQzM30.z9e1GQwvI-0HSFzQphc2jU1UFqp_RUzZC0zT43jSe-s'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

// Alumni API functions
class AlumniAPI {
    static async getAlumni(filters = {}) {
        let query = supabase
            .from('alumni')
            .select('*')
            .eq('is_active', true)
            .eq('privacy_directory', true)
            .order('tahun_lulus', { ascending: false });

        if (filters.graduation_year) {
            query = query.eq('tahun_lulus', filters.graduation_year);
        }
        if (filters.industry) {
            query = query.eq('industri', filters.industry);
        }
        if (filters.location) {
            query = query.ilike('lokasi', `%${filters.location}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    static async getAlumniStats() {
        const { data, error } = await supabase
            .from('alumni')
            .select('industri, lokasi, tahun_lulus')
            .eq('is_active', true);

        if (error) throw error;

        const stats = {
            total: data.length,
            byIndustry: {},
            byLocation: {},
            byYear: {}
        };

        data.forEach(alumni => {
            // Count by industry - Fixed property names
            if (alumni.industri) {
                stats.byIndustry[alumni.industri] = (stats.byIndustry[alumni.industri] || 0) + 1;
            }
            
            // Count by location - Fixed property names
            if (alumni.lokasi) {
                stats.byLocation[alumni.lokasi] = (stats.byLocation[alumni.lokasi] || 0) + 1;
            }
            
            // Count by year - Fixed property names
            if (alumni.tahun_lulus) {
                stats.byYear[alumni.tahun_lulus] = (stats.byYear[alumni.tahun_lulus] || 0) + 1;
            }
        });

        return stats;
    }

    static async submitUpdate(formData) {
        const { data, error } = await supabase
            .from('submissions')
            .insert([formData]);

        if (error) throw error;
        return data;
    }
}

// News API functions
class NewsAPI {
    static async getNews(limit = 10) {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    }

    static async getFeaturedNews() {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('is_published', true)
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) throw error;
        return data;
    }
}

// Make APIs available globally
window.AlumniAPI = AlumniAPI;
window.NewsAPI = NewsAPI;