import { createAdminClient } from './supabase';
import { slugify } from './utils';

export interface SeedMovie {
  title: string;
  release_year: number;
  language: string;
  genre: string[];
  category: string;
  quality: string;
  file_size: string;
  description: string;
  poster_url: string;
  is_web_series: boolean;
  view_count: number;
  destinations: { label: string; url: string }[];
}

export const SAMPLE_MOVIES: SeedMovie[] = [
  {
    title: 'Vikram Vedha: The Dark Chronicle',
    release_year: 2024,
    language: 'Tamil',
    genre: ['Action', 'Crime', 'Thriller'],
    category: 'Movie',
    quality: '1080p HQ',
    file_size: '2.4 GB',
    description: 'A tough police officer sets out to track down and kill an equally tough gangster who challenges his moral compass with riddle-filled interrogations.',
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 1420,
    destinations: [
      { label: 'Download 1080p [2.4 GB]', url: 'https://archive.org/download/sample_video_1080p' },
      { label: 'Download 720p [1.1 GB]', url: 'https://archive.org/download/sample_video_720p' },
    ],
  },
  {
    title: 'Devara: Reign of the Sea',
    release_year: 2024,
    language: 'Telugu',
    genre: ['Action', 'Drama'],
    category: 'Movie',
    quality: '4K UHD',
    file_size: '4.8 GB',
    description: 'An epic coastal drama chronicling the fearsome leader of a coastal clan who battles betrayal to protect his people across generations.',
    poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 2890,
    destinations: [
      { label: 'Download 4K UHD [4.8 GB]', url: 'https://archive.org/download/sample_movie_4k' },
      { label: 'Download 1080p [2.1 GB]', url: 'https://archive.org/download/sample_movie_1080p' },
    ],
  },
  {
    title: 'Aavesham: College Days',
    release_year: 2024,
    language: 'Malayalam',
    genre: ['Comedy', 'Action'],
    category: 'Movie',
    quality: '1080p WEB-DL',
    file_size: '1.9 GB',
    description: 'Three college students in Bangalore find themselves in trouble with seniors and seek the help of an eccentric local gangster named Ranga.',
    poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 3200,
    destinations: [
      { label: 'Download 1080p [1.9 GB]', url: 'https://archive.org/download/sample_aavesham_1080p' },
      { label: 'Download 720p [950 MB]', url: 'https://archive.org/download/sample_aavesham_720p' },
    ],
  },
  {
    title: 'Kantara: Legend of the Forest',
    release_year: 2023,
    language: 'Kannada',
    genre: ['Action', 'Drama', 'Fantasy'],
    category: 'Movie',
    quality: '1080p HDRip',
    file_size: '2.2 GB',
    description: 'When greed paves the way for betrayal and scheming, a young tribal champion takes up the divine mantle to preserve ancient traditions.',
    poster_url: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 4500,
    destinations: [
      { label: 'Download 1080p [2.2 GB]', url: 'https://archive.org/download/sample_kantara_1080p' },
    ],
  },
  {
    title: 'Stree 2: Sarkate Ka Aatank',
    release_year: 2024,
    language: 'Hindi',
    genre: ['Comedy', 'Horror'],
    category: 'Movie',
    quality: '1080p HQ',
    file_size: '2.0 GB',
    description: 'The town of Chanderi is haunted once again, this time by a headless entity that abducts modern independent women.',
    poster_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 5120,
    destinations: [
      { label: 'Download 1080p [2.0 GB]', url: 'https://archive.org/download/sample_stree2_1080p' },
    ],
  },
  {
    title: 'Dune: Part Two Prophecy',
    release_year: 2024,
    language: 'English',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    category: 'Movie',
    quality: '4K IMAX',
    file_size: '6.2 GB',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    poster_url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 7300,
    destinations: [
      { label: 'Download 4K IMAX [6.2 GB]', url: 'https://archive.org/download/sample_dune_4k' },
      { label: 'Download 1080p [2.8 GB]', url: 'https://archive.org/download/sample_dune_1080p' },
    ],
  },
  {
    title: 'Mirzapur: Season 3',
    release_year: 2024,
    language: 'Hindi',
    genre: ['Crime', 'Action', 'Drama'],
    category: 'Web Series',
    quality: '1080p Complete',
    file_size: '7.5 GB',
    description: 'The battle for the throne of Mirzapur intensifies with unexpected alliances, brutal power shifts, and bloody confrontations.',
    poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    is_web_series: true,
    view_count: 6100,
    destinations: [
      { label: 'All Episodes 1080p Zip [7.5 GB]', url: 'https://archive.org/download/mirzapur_s3_pack' },
      { label: 'Episode 1-5 [3.8 GB]', url: 'https://archive.org/download/mirzapur_s3_part1' },
    ],
  },
  {
    title: 'The Family Man: Special Mission',
    release_year: 2023,
    language: 'Hindi',
    genre: ['Action', 'Thriller', 'Comedy'],
    category: 'Web Series',
    quality: '1080p Complete',
    file_size: '6.8 GB',
    description: 'A middle-class man who secretly works as an intelligence officer struggles to balance his undercover life with domestic tribulations.',
    poster_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    is_web_series: true,
    view_count: 3800,
    destinations: [
      { label: 'Complete Series [6.8 GB]', url: 'https://archive.org/download/familyman_complete' },
    ],
  },
  {
    title: 'Suzhal: The Vortex Mystery',
    release_year: 2023,
    language: 'Tamil',
    genre: ['Crime', 'Mystery', 'Thriller'],
    category: 'Web Series',
    quality: '1080p HDRip',
    file_size: '4.5 GB',
    description: 'In a small hill station during a vibrant annual festival, a factory fire and the disappearance of a teenage girl shatter tranquility.',
    poster_url: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=600&auto=format&fit=crop&q=80',
    is_web_series: true,
    view_count: 2400,
    destinations: [
      { label: 'All Episodes [4.5 GB]', url: 'https://archive.org/download/suzhal_complete' },
    ],
  },
  {
    title: 'Leo: Bloody Sweet Revenge',
    release_year: 2023,
    language: 'Tamil',
    genre: ['Action', 'Crime', 'Thriller'],
    category: 'Movie',
    quality: '4K UHD',
    file_size: '5.1 GB',
    description: 'A mild-mannered cafe owner in Himachal Pradesh becomes a local hero, attracting the deadly interest of a notorious crime syndicate.',
    poster_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 8900,
    destinations: [
      { label: 'Download 4K UHD [5.1 GB]', url: 'https://archive.org/download/leo_4k_sample' },
      { label: 'Download 1080p [2.4 GB]', url: 'https://archive.org/download/leo_1080p_sample' },
    ],
  },
  {
    title: 'Salaar: Part 1 - Ceasefire',
    release_year: 2023,
    language: 'Telugu',
    genre: ['Action', 'Crime', 'Drama'],
    category: 'Movie',
    quality: '1080p HQ',
    file_size: '2.7 GB',
    description: 'A gang leader makes a promise to a dying friend and takes on other criminal factions in the dystopian city of Khansaar.',
    poster_url: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 7600,
    destinations: [
      { label: 'Download 1080p [2.7 GB]', url: 'https://archive.org/download/salaar_1080p' },
    ],
  },
  {
    title: 'Manjummel Boys: The Rescue',
    release_year: 2024,
    language: 'Malayalam',
    genre: ['Adventure', 'Drama', 'Thriller'],
    category: 'Movie',
    quality: '1080p WEB-DL',
    file_size: '2.1 GB',
    description: 'A group of friends from a small town in Kerala embark on a trip to Kodaikanal where one slips into the deadly Guna Caves.',
    poster_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 6500,
    destinations: [
      { label: 'Download 1080p [2.1 GB]', url: 'https://archive.org/download/manjummel_1080p' },
    ],
  },
  {
    title: 'Pushpa 2: The Rule',
    release_year: 2024,
    language: 'Telugu',
    genre: ['Action', 'Crime', 'Thriller'],
    category: 'Movie',
    quality: '4K Atmos',
    file_size: '6.5 GB',
    description: 'Pushpa Raj expands his red sandalwood empire while fending off law enforcement and dangerous rival syndicates.',
    poster_url: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 11200,
    destinations: [
      { label: 'Download 4K [6.5 GB]', url: 'https://archive.org/download/pushpa2_4k' },
    ],
  },
  {
    title: 'Jailer: Tiger Muthuvel Pandian',
    release_year: 2023,
    language: 'Tamil',
    genre: ['Action', 'Comedy', 'Crime'],
    category: 'Movie',
    quality: '1080p HDRip',
    file_size: '2.6 GB',
    description: 'A retired prison officer embarks on a relentless manhunt after his police officer son is presumed dead while investigating an idol smuggling ring.',
    poster_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 9400,
    destinations: [
      { label: 'Download 1080p [2.6 GB]', url: 'https://archive.org/download/jailer_1080p' },
    ],
  },
  {
    title: 'Kalki 2898 AD: The Awakening',
    release_year: 2024,
    language: 'Telugu',
    genre: ['Sci-Fi', 'Action', 'Fantasy'],
    category: 'Movie',
    quality: '4K UHD HDR',
    file_size: '7.1 GB',
    description: 'Set in a post-apocalyptic world in 2898 AD, a mysterious bounty hunter and ancient protectors unite to safeguard the unborn avatar.',
    poster_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 12500,
    destinations: [
      { label: 'Download 4K UHD [7.1 GB]', url: 'https://archive.org/download/kalki_4k' },
    ],
  },
  {
    title: 'Deadpool & Wolverine: Multiverse Chaos',
    release_year: 2024,
    language: 'English',
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    category: 'Movie',
    quality: '1080p IMAX',
    file_size: '2.9 GB',
    description: 'Wade Wilson and Logan team up across divergent timelines to defeat a common threat threatening their homeworlds.',
    poster_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 10400,
    destinations: [
      { label: 'Download 1080p [2.9 GB]', url: 'https://archive.org/download/dp_wolverine_1080p' },
    ],
  },
  {
    title: 'Bramayugam: Age of Darkness',
    release_year: 2024,
    language: 'Malayalam',
    genre: ['Horror', 'Mystery', 'Thriller'],
    category: 'Movie',
    quality: '1080p Monochrome',
    file_size: '2.0 GB',
    description: 'A folk singer fleeing slavery finds refuge in a decrepit mansion governed by an enigmatic landlord harboring ancient dark secrets.',
    poster_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 4800,
    destinations: [
      { label: 'Download 1080p [2.0 GB]', url: 'https://archive.org/download/bramayugam_1080p' },
    ],
  },
  {
    title: 'Lucifer 2: Empuraan',
    release_year: 2025,
    language: 'Malayalam',
    genre: ['Action', 'Crime', 'Drama'],
    category: 'Movie',
    quality: '1080p HQ',
    file_size: '3.1 GB',
    description: 'The saga of Stephen Nedumpally continues across global cartels and political spheres in this high-octane political thriller sequel.',
    poster_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 3600,
    destinations: [
      { label: 'Download 1080p [3.1 GB]', url: 'https://archive.org/download/empuraan_1080p' },
    ],
  },
  {
    title: 'K.G.F: Chapter 3 Chronicles',
    release_year: 2025,
    language: 'Kannada',
    genre: ['Action', 'Crime', 'Drama'],
    category: 'Movie',
    quality: '4K Ultra',
    file_size: '6.0 GB',
    description: 'The legacy of Rocky Bhai and his international syndicate encounters unseen adversaries in the Mediterranean waters.',
    poster_url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 14000,
    destinations: [
      { label: 'Download 4K Ultra [6.0 GB]', url: 'https://archive.org/download/kgf3_4k' },
    ],
  },
  {
    title: 'Stranger Things: Season 5 Finale',
    release_year: 2025,
    language: 'English',
    genre: ['Drama', 'Fantasy', 'Horror'],
    category: 'Web Series',
    quality: '4K Dolby Vision',
    file_size: '12.0 GB',
    description: 'The kids of Hawkins make their ultimate stand against Vecna and the creeping shadows of the Upside Down.',
    poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    is_web_series: true,
    view_count: 15600,
    destinations: [
      { label: 'Season 5 Complete Pack [12 GB]', url: 'https://archive.org/download/strangerthings_s5' },
    ],
  },
  {
    title: 'Amaran: Courage & Honor',
    release_year: 2024,
    language: 'Tamil',
    genre: ['Action', 'Biography', 'War'],
    category: 'Movie',
    quality: '1080p TrueHD',
    file_size: '2.5 GB',
    description: 'The real-life heroics of Major Mukund Varadarajan and his Rajput regiment during counter-terrorism operations in Kashmir.',
    poster_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 7800,
    destinations: [
      { label: 'Download 1080p [2.5 GB]', url: 'https://archive.org/download/amaran_1080p' },
    ],
  },
  {
    title: 'Squid Game: Season 2 Arena',
    release_year: 2024,
    language: 'Korean',
    genre: ['Action', 'Drama', 'Mystery'],
    category: 'Web Series',
    quality: '1080p Dual Audio',
    file_size: '5.8 GB',
    description: 'Player 456 returns into the sinister game with a vengeance, attempting to dismantle the organization from within.',
    poster_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    is_web_series: true,
    view_count: 18200,
    destinations: [
      { label: 'All Episodes 1080p [5.8 GB]', url: 'https://archive.org/download/squidgame_s2' },
    ],
  },
  {
    title: 'Vettaiyan: The Hunter',
    release_year: 2024,
    language: 'Tamil',
    genre: ['Action', 'Drama', 'Crime'],
    category: 'Movie',
    quality: '1080p HDRip',
    file_size: '2.8 GB',
    description: 'An encounter specialist cop clashes with an upright judiciary commissioner regarding moral questions of extrajudicial justice.',
    poster_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 5900,
    destinations: [
      { label: 'Download 1080p [2.8 GB]', url: 'https://archive.org/download/vettaiyan_1080p' },
    ],
  },
  {
    title: 'Game of Thrones: House of the Dragon S2',
    release_year: 2024,
    language: 'English',
    genre: ['Action', 'Adventure', 'Fantasy'],
    category: 'Web Series',
    quality: '1080p 5.1',
    file_size: '8.4 GB',
    description: 'The Targaryen civil war explodes into open warfare with dragon clashes across the Seven Kingdoms.',
    poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    is_web_series: true,
    view_count: 11900,
    destinations: [
      { label: 'Complete Season 2 [8.4 GB]', url: 'https://archive.org/download/hotd_s2_pack' },
    ],
  },
  {
    title: 'Premalu: Love in Hyderabad',
    release_year: 2024,
    language: 'Malayalam',
    genre: ['Comedy', 'Romance'],
    category: 'Movie',
    quality: '720p HQ',
    file_size: '1.2 GB',
    description: 'A charming youth navigates career uncertainties and unrequited romance in the bustling IT hubs of Hyderabad.',
    poster_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 4100,
    destinations: [
      { label: 'Download 720p [1.2 GB]', url: 'https://archive.org/download/premalu_720p' },
    ],
  },
  {
    title: 'Fighter: Air Strike Legends',
    release_year: 2024,
    language: 'Hindi',
    genre: ['Action', 'Thriller', 'War'],
    category: 'Movie',
    quality: '1080p HQ',
    file_size: '2.5 GB',
    description: 'Top Indian Air Force aviators bond through grueling aerial combat trials and protect the nation against hostile incursions.',
    poster_url: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 5300,
    destinations: [
      { label: 'Download 1080p [2.5 GB]', url: 'https://archive.org/download/fighter_1080p' },
    ],
  },
  {
    title: 'Thangalaan: Gold Rush of KGF',
    release_year: 2024,
    language: 'Tamil',
    genre: ['Action', 'Adventure', 'Drama'],
    category: 'Movie',
    quality: '1080p TrueHD',
    file_size: '2.4 GB',
    description: 'A fiery tribal chieftain aids British explorers in finding gold in exchange for land rights, facing mythical guardians in the woods.',
    poster_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 6700,
    destinations: [
      { label: 'Download 1080p [2.4 GB]', url: 'https://archive.org/download/thangalaan_1080p' },
    ],
  },
  {
    title: 'The Boys: Season 4 Reckoning',
    release_year: 2024,
    language: 'English',
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    category: 'Web Series',
    quality: '1080p HDR',
    file_size: '6.4 GB',
    description: 'With Victoria Neuman closer than ever to the Oval Office and Homelander consolidating his grip on power, Butcher has only months left to live.',
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    is_web_series: true,
    view_count: 13500,
    destinations: [
      { label: 'All Episodes [6.4 GB]', url: 'https://archive.org/download/theboys_s4' },
    ],
  },
  {
    title: 'Guntur Kaaram: Spicy Flavours',
    release_year: 2024,
    language: 'Telugu',
    genre: ['Action', 'Drama'],
    category: 'Movie',
    quality: '1080p HQ',
    file_size: '2.3 GB',
    description: 'The unruly king of the underworld in Guntur discovers the hidden family truth behind his mother abandoning him twenty-five years ago.',
    poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    is_web_series: false,
    view_count: 5200,
    destinations: [
      { label: 'Download 1080p [2.3 GB]', url: 'https://archive.org/download/guntur_kaaram_1080p' },
    ],
  },
  {
    title: 'Loki: Season 2 Glorious Purpose',
    release_year: 2023,
    language: 'English',
    genre: ['Action', 'Adventure', 'Fantasy'],
    category: 'Web Series',
    quality: '4K Dolby Vision',
    file_size: '7.8 GB',
    description: 'Loki navigates slipping through time at the TVA to preserve timelines from unraveling into multiversal annihilation.',
    poster_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    is_web_series: true,
    view_count: 8800,
    destinations: [
      { label: 'Download Complete S2 [7.8 GB]', url: 'https://archive.org/download/loki_s2_pack' },
    ],
  },
];

export async function seedDemoData(): Promise<{ inserted: number; errors: string[] }> {
  const supabase = createAdminClient();
  let inserted = 0;
  const errors: string[] = [];

  for (const m of SAMPLE_MOVIES) {
    try {
      const slug = slugify(m.title);

      // Check if movie exists
      const { data: existing } = await supabase
        .from('movies')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      let movieId = existing?.id;

      if (!movieId) {
        const { data: insertedMovie, error: insertError } = await supabase
          .from('movies')
          .insert({
            title: m.title,
            slug,
            description: m.description,
            poster_url: m.poster_url,
            release_year: m.release_year,
            language: m.language,
            genre: m.genre,
            category: m.category,
            quality: m.quality,
            file_size: m.file_size,
            view_count: m.view_count,
            is_web_series: m.is_web_series,
            published_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
            source_id: `seed-${slug}`,
          })
          .select('id')
          .single();

        if (insertError) {
          errors.push(`Error inserting ${m.title}: ${insertError.message}`);
          continue;
        }

        movieId = insertedMovie.id;
        inserted++;
      }

      // Insert destinations
      if (movieId && m.destinations.length > 0) {
        for (const dest of m.destinations) {
          const { error: destError } = await supabase
            .from('destinations')
            .upsert({
              movie_id: movieId,
              label: dest.label,
              original_url: dest.url,
            }, { onConflict: 'movie_id,label' });

          if (destError) {
            // Non-fatal destination error
            console.warn(`Destination insert note: ${destError.message}`);
          }
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`Exception on ${m.title}: ${msg}`);
    }
  }

  return { inserted, errors };
}

