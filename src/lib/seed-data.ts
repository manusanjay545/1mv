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
    title: 'Leo',
    release_year: 2023,
    language: 'Tamil',
    genre: ['Action', 'Crime', 'Thriller'],
    category: 'Movie',
    quality: '4K UHD HDR',
    file_size: '4.2 GB',
    description: 'Parthiban is a mild-mannered cafe owner in Himachal Pradesh who gets dragged into a violent confrontation with a cartel who mistake him for Leo Das, a dangerous criminal from their past.',
    poster_url: '/posters/leo-2023.jpg',
    is_web_series: false,
    view_count: 9850,
    destinations: [
      { label: 'Download 4K UHD [4.2 GB]', url: 'https://archive.org/download/sample_leo_4k' },
      { label: 'Download 1080p HQ [2.4 GB]', url: 'https://archive.org/download/sample_leo_1080p' },
      { label: 'Download 720p HD [1.2 GB]', url: 'https://archive.org/download/sample_leo_720p' },
    ],
  },
  {
    title: 'Jailer',
    release_year: 2023,
    language: 'Tamil',
    genre: ['Action', 'Comedy', 'Crime'],
    category: 'Movie',
    quality: '1080p Proper HQ',
    file_size: '2.6 GB',
    description: 'Muthuvel Pandian, a retired prison warden, embarks on a relentless crusade to avenge his police officer son who disappeared while investigating an idol-smuggling mafia.',
    poster_url: '/posters/jailer-2023.jpg',
    is_web_series: false,
    view_count: 8740,
    destinations: [
      { label: 'Download 1080p Proper [2.6 GB]', url: 'https://archive.org/download/sample_jailer_1080p' },
      { label: 'Download 720p HQ [1.3 GB]', url: 'https://archive.org/download/sample_jailer_720p' },
    ],
  },
  {
    title: 'Devara: Part 1',
    release_year: 2024,
    language: 'Telugu',
    genre: ['Action', 'Drama'],
    category: 'Movie',
    quality: '4K UHD Proper',
    file_size: '4.8 GB',
    description: 'An epic coastal saga chronicling Devara, the brave guardian of the coastal clan who takes a stand against maritime smuggling and betrayal across generations.',
    poster_url: '/posters/devara-part-1.jpg',
    is_web_series: false,
    view_count: 11200,
    destinations: [
      { label: 'Download 4K UHD [4.8 GB]', url: 'https://archive.org/download/sample_devara_4k' },
      { label: 'Download 1080p HQ [2.2 GB]', url: 'https://archive.org/download/sample_devara_1080p' },
    ],
  },
  {
    title: 'Aavesham',
    release_year: 2024,
    language: 'Malayalam',
    genre: ['Action', 'Comedy'],
    category: 'Movie',
    quality: '1080p WEB-DL',
    file_size: '2.1 GB',
    description: 'Three Malayali engineering students in Bangalore find themselves in conflict with seniors and seek the help of an eccentric, white-clad local gangster named Ranga.',
    poster_url: '/posters/aavesham-college-days.jpg',
    is_web_series: false,
    view_count: 10450,
    destinations: [
      { label: 'Download 1080p WEB-DL [2.1 GB]', url: 'https://archive.org/download/sample_aavesham_1080p' },
      { label: 'Download 720p HQ [1.1 GB]', url: 'https://archive.org/download/sample_aavesham_720p' },
    ],
  },
  {
    title: 'Manjummel Boys',
    release_year: 2024,
    language: 'Malayalam',
    genre: ['Adventure', 'Drama', 'Thriller'],
    category: 'Movie',
    quality: '1080p Proper HQ',
    file_size: '2.4 GB',
    description: 'A group of friends from a small town in Kerala embark on a vacation to Kodaikanal, where one of them falls deep into the perilous Guna Caves in a harrowing true survival story.',
    poster_url: '/posters/manjummel-boys.jpg',
    is_web_series: false,
    view_count: 12900,
    destinations: [
      { label: 'Download 1080p HQ [2.4 GB]', url: 'https://archive.org/download/sample_manjummel_1080p' },
      { label: 'Download 720p [1.2 GB]', url: 'https://archive.org/download/sample_manjummel_720p' },
    ],
  },
  {
    title: 'Pushpa 2: The Rule',
    release_year: 2024,
    language: 'Telugu',
    genre: ['Action', 'Crime', 'Drama'],
    category: 'Movie',
    quality: '4K UHD IMAX',
    file_size: '5.2 GB',
    description: 'Pushpa Raj solidifies his rule over the red sandalwood smuggling empire while facing escalating vendettas from SP Bhanwar Singh Shekhawat and rival syndicates.',
    poster_url: '/posters/pushpa-2-the-rule.jpg',
    is_web_series: false,
    view_count: 15800,
    destinations: [
      { label: 'Download 4K IMAX [5.2 GB]', url: 'https://archive.org/download/sample_pushpa2_4k' },
      { label: 'Download 1080p HQ [2.5 GB]', url: 'https://archive.org/download/sample_pushpa2_1080p' },
    ],
  },
  {
    title: 'Amaran',
    release_year: 2024,
    language: 'Tamil',
    genre: ['Action', 'Biography', 'Drama'],
    category: 'Movie',
    quality: '1080p Proper HQ',
    file_size: '2.5 GB',
    description: 'The heroic real-life chronicle of Major Mukund Varadarajan, an Indian Army officer awarded the Ashoka Chakra for courage during anti-terror operations in Kashmir.',
    poster_url: '/posters/amaran-2024.jpg',
    is_web_series: false,
    view_count: 9400,
    destinations: [
      { label: 'Download 1080p Proper [2.5 GB]', url: 'https://archive.org/download/sample_amaran_1080p' },
      { label: 'Download 720p HD [1.2 GB]', url: 'https://archive.org/download/sample_amaran_720p' },
    ],
  },
  {
    title: 'Kalki 2898 AD',
    release_year: 2024,
    language: 'Telugu',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    category: 'Movie',
    quality: '4K UHD Proper',
    file_size: '5.6 GB',
    description: 'In a dystopian post-apocalyptic city ruled by Supreme Yaskin, the immortal Ashwatthama rises to safeguard the pregnant mother of the divine avatar Kalki.',
    poster_url: '/posters/kalki-2898-ad.jpg',
    is_web_series: false,
    view_count: 14600,
    destinations: [
      { label: 'Download 4K UHD [5.6 GB]', url: 'https://archive.org/download/sample_kalki_4k' },
      { label: 'Download 1080p HQ [2.6 GB]', url: 'https://archive.org/download/sample_kalki_1080p' },
    ],
  },
  {
    title: 'Kantara',
    release_year: 2022,
    language: 'Kannada',
    genre: ['Action', 'Drama', 'Fantasy'],
    category: 'Movie',
    quality: '1080p HDRip',
    file_size: '2.2 GB',
    description: 'Set in the coastal forests of Karnataka, a rebellious Kambala champion clashes with a righteous forest officer and invokes the divine spirit of Panjurli Daiva.',
    poster_url: '/posters/kantara-legend-of-the-forest.jpg',
    is_web_series: false,
    view_count: 11100,
    destinations: [
      { label: 'Download 1080p [2.2 GB]', url: 'https://archive.org/download/sample_kantara_1080p' },
      { label: 'Download 720p [1.0 GB]', url: 'https://archive.org/download/sample_kantara_720p' },
    ],
  },
  {
    title: 'Vikram',
    release_year: 2022,
    language: 'Tamil',
    genre: ['Action', 'Crime', 'Thriller'],
    category: 'Movie',
    quality: '1080p Proper HQ',
    file_size: '2.8 GB',
    description: 'Amar, leader of a covert black-ops team, probes a string of masked vigilante assassinations that trace back to Karnan and a legendary operative known as Vikram.',
    poster_url: '/posters/vikram-vedha-the-dark-chronicle.jpg',
    is_web_series: false,
    view_count: 13400,
    destinations: [
      { label: 'Download 1080p Proper [2.8 GB]', url: 'https://archive.org/download/sample_vikram_1080p' },
      { label: 'Download 720p [1.3 GB]', url: 'https://archive.org/download/sample_vikram_720p' },
    ],
  },
  {
    title: 'Salaar: Part 1 – Ceasefire',
    release_year: 2023,
    language: 'Telugu',
    genre: ['Action', 'Crime', 'Drama'],
    category: 'Movie',
    quality: '4K UHD HDR',
    file_size: '4.5 GB',
    description: 'In the lawless walled kingdom of Khansaar, Deva returns to stand shoulder to shoulder with his childhood brother Varadha during a bloody coup for the throne.',
    poster_url: '/posters/salaar-part-1-ceasefire.jpg',
    is_web_series: false,
    view_count: 10900,
    destinations: [
      { label: 'Download 4K UHD [4.5 GB]', url: 'https://archive.org/download/sample_salaar_4k' },
      { label: 'Download 1080p HQ [2.3 GB]', url: 'https://archive.org/download/sample_salaar_1080p' },
    ],
  },
  {
    title: 'RRR',
    release_year: 2022,
    language: 'Telugu',
    genre: ['Action', 'Drama'],
    category: 'Movie',
    quality: '4K Dolby Vision',
    file_size: '5.4 GB',
    description: 'A fictional tale of two legendary Indian revolutionaries, Alluri Sitarama Raju and Komaram Bheem, and their epic battle against the tyrannical British Raj in the 1920s.',
    poster_url: '/posters/rrr-rise-roar-revolt.jpg',
    is_web_series: false,
    view_count: 16200,
    destinations: [
      { label: 'Download 4K Dolby Vision [5.4 GB]', url: 'https://archive.org/download/sample_rrr_4k' },
      { label: 'Download 1080p HQ [2.5 GB]', url: 'https://archive.org/download/sample_rrr_1080p' },
    ],
  },
  {
    title: 'K.G.F: Chapter 1',
    release_year: 2018,
    language: 'Kannada',
    genre: ['Action', 'Crime', 'Drama'],
    category: 'Movie',
    quality: '1080p HQ',
    file_size: '2.6 GB',
    description: 'Rocky, a fierce young assassin from Bombay, infiltrates the brutal, slave-driven gold mines of Kolar with an unyielding ambition to fulfill his mother’s dying promise.',
    poster_url: '/posters/kgf-chapter-1.jpg',
    is_web_series: false,
    view_count: 12500,
    destinations: [
      { label: 'Download 1080p HQ [2.6 GB]', url: 'https://archive.org/download/sample_kgf1_1080p' },
      { label: 'Download 720p [1.2 GB]', url: 'https://archive.org/download/sample_kgf1_720p' },
    ],
  },
  {
    title: 'K.G.F: Chapter 2',
    release_year: 2022,
    language: 'Kannada',
    genre: ['Action', 'Crime', 'Drama'],
    category: 'Movie',
    quality: '4K UHD Proper',
    file_size: '5.0 GB',
    description: 'Now ruler of the Kolar Gold Fields, Rocky faces his deadliest adversaries: the monstrous Adheera, the ruthless Inayat Khalil, and Indian Prime Minister Ramika Sen.',
    poster_url: '/posters/kgf-chapter-2.jpg',
    is_web_series: false,
    view_count: 15100,
    destinations: [
      { label: 'Download 4K UHD [5.0 GB]', url: 'https://archive.org/download/sample_kgf2_4k' },
      { label: 'Download 1080p HQ [2.6 GB]', url: 'https://archive.org/download/sample_kgf2_1080p' },
    ],
  },
  {
    title: 'Deadpool & Wolverine',
    release_year: 2024,
    language: 'English',
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    category: 'Movie',
    quality: '4K UHD IMAX',
    file_size: '4.1 GB',
    description: 'Wade Wilson is pulled from quiet domestic life by the Time Variance Authority and teams up with a reluctant, battle-weary Wolverine on a reality-bending multiverse mission.',
    poster_url: '/posters/deadpool-and-wolverine.jpg',
    is_web_series: false,
    view_count: 13900,
    destinations: [
      { label: 'Download 4K IMAX [4.1 GB]', url: 'https://archive.org/download/sample_deadpool_4k' },
      { label: 'Download 1080p HQ [2.1 GB]', url: 'https://archive.org/download/sample_deadpool_1080p' },
    ],
  },
  {
    title: 'Oppenheimer',
    release_year: 2023,
    language: 'English',
    genre: ['Biography', 'Drama', 'History'],
    category: 'Movie',
    quality: '4K UHD HDR',
    file_size: '5.8 GB',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II with the Manhattan Project.',
    poster_url: '/posters/oppenheimer.jpg',
    is_web_series: false,
    view_count: 14200,
    destinations: [
      { label: 'Download 4K UHD [5.8 GB]', url: 'https://archive.org/download/sample_oppenheimer_4k' },
      { label: 'Download 1080p HQ [2.8 GB]', url: 'https://archive.org/download/sample_oppenheimer_1080p' },
    ],
  },
  {
    title: 'Interstellar',
    release_year: 2014,
    language: 'English',
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    category: 'Movie',
    quality: '1080p Remux',
    file_size: '3.5 GB',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers through a wormhole.',
    poster_url: '/posters/interstellar.jpg',
    is_web_series: false,
    view_count: 17500,
    destinations: [
      { label: 'Download 1080p Remux [3.5 GB]', url: 'https://archive.org/download/sample_interstellar_1080p' },
    ],
  },
  {
    title: 'Dune: Part One',
    release_year: 2021,
    language: 'English',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    category: 'Movie',
    quality: '4K UHD Proper',
    file_size: '4.6 GB',
    description: 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family.',
    poster_url: '/posters/dune-part-one.jpg',
    is_web_series: false,
    view_count: 11800,
    destinations: [
      { label: 'Download 4K UHD [4.6 GB]', url: 'https://archive.org/download/sample_dune1_4k' },
    ],
  },
  {
    title: 'Dune: Part Two',
    release_year: 2024,
    language: 'English',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    category: 'Movie',
    quality: '4K UHD IMAX',
    file_size: '5.2 GB',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, striving to prevent a terrible future only he can foresee.',
    poster_url: '/posters/dune-part-two.jpg',
    is_web_series: false,
    view_count: 14900,
    destinations: [
      { label: 'Download 4K IMAX [5.2 GB]', url: 'https://archive.org/download/sample_dune2_4k' },
      { label: 'Download 1080p HQ [2.4 GB]', url: 'https://archive.org/download/sample_dune2_1080p' },
    ],
  },
  {
    title: 'Mirzapur: Season 3',
    release_year: 2024,
    language: 'Hindi',
    genre: ['Action', 'Crime', 'Drama'],
    category: 'Web Series',
    quality: '1080p All Episodes',
    file_size: '4.2 GB',
    description: 'With Munna Tripathi dead and Akhandanand incapacitated, Guddu Pandit and Golu Gupta take over the throne of Mirzapur while battling enemies from Lucknow to Jaunpur.',
    poster_url: '/posters/mirzapur-season-3.jpg',
    is_web_series: true,
    view_count: 16800,
    destinations: [
      { label: 'Download Season 3 Complete [4.2 GB]', url: 'https://archive.org/download/sample_mirzapur3' },
    ],
  },
  {
    title: 'Jawan',
    release_year: 2023,
    language: 'Hindi',
    genre: ['Action', 'Thriller'],
    category: 'Movie',
    quality: '1080p Extended Cut',
    file_size: '3.0 GB',
    description: 'A prison warden recruits inmates to commit outrageous acts of vigilante justice across India to right societal wrongs, leading to an emotional reunion with his long-lost father.',
    poster_url: '/posters/jawan-2023.jpg',
    is_web_series: false,
    view_count: 13200,
    destinations: [
      { label: 'Download 1080p Extended [3.0 GB]', url: 'https://archive.org/download/sample_jawan_1080p' },
    ],
  },
  {
    title: 'Animal',
    release_year: 2023,
    language: 'Hindi',
    genre: ['Action', 'Crime', 'Drama'],
    category: 'Movie',
    quality: '1080p Uncut WEB-DL',
    file_size: '3.2 GB',
    description: 'A son’s obsessive and toxic love for his estranged father triggers a violent underworld war when an assassination attempt leaves the billionaire patriarch fighting for his life.',
    poster_url: '/posters/animal-2023.jpg',
    is_web_series: false,
    view_count: 12400,
    destinations: [
      { label: 'Download 1080p Uncut [3.2 GB]', url: 'https://archive.org/download/sample_animal_1080p' },
    ],
  },
  {
    title: 'Maharaja',
    release_year: 2024,
    language: 'Tamil',
    genre: ['Action', 'Crime', 'Drama'],
    category: 'Movie',
    quality: '1080p Proper HQ',
    file_size: '2.3 GB',
    description: 'A modest barber reports a bizarre robbery of his missing dustbin Lakshmi to the police, uncovering a dark, labyrinthine web of revenge and retribution.',
    poster_url: '/posters/maharaja-2024.jpg',
    is_web_series: false,
    view_count: 11600,
    destinations: [
      { label: 'Download 1080p Proper [2.3 GB]', url: 'https://archive.org/download/sample_maharaja_1080p' },
    ],
  },
  {
    title: 'Stree 2: Sarkate Ka Aatank',
    release_year: 2024,
    language: 'Hindi',
    genre: ['Comedy', 'Horror'],
    category: 'Movie',
    quality: '1080p HQ WEB-DL',
    file_size: '2.4 GB',
    description: 'After the events of Stree, the town of Chanderi is terrorized by a headless ghost named Sarkata who abducts progressive women, forcing Vicky and his gang to seek Stree’s help.',
    poster_url: '/posters/stree-2-sarkate-ka-aatank.jpg',
    is_web_series: false,
    view_count: 14800,
    destinations: [
      { label: 'Download 1080p HQ [2.4 GB]', url: 'https://archive.org/download/sample_stree2_1080p' },
    ],
  },
  {
    title: 'Bramayugam',
    release_year: 2024,
    language: 'Malayalam',
    genre: ['Horror', 'Mystery', 'Thriller'],
    category: 'Movie',
    quality: '1080p Monochrome',
    file_size: '2.0 GB',
    description: 'A folk singer fleeing 17th-century slavery seeks sanctuary in a crumbling feudal mansion ruled by Kodumon Potti, an enigmatic patriarch harboring sinister occult powers.',
    poster_url: '/posters/bramayugam-age-of-darkness.jpg',
    is_web_series: false,
    view_count: 9100,
    destinations: [
      { label: 'Download 1080p Monochrome [2.0 GB]', url: 'https://archive.org/download/sample_bramayugam_1080p' },
    ],
  },
  {
    title: 'Premalu',
    release_year: 2024,
    language: 'Malayalam',
    genre: ['Comedy', 'Romance'],
    category: 'Movie',
    quality: '1080p Proper HQ',
    file_size: '1.8 GB',
    description: 'Sachin, an ambition-free graduate preparing for GATE in Hyderabad, falls head over heels for Reenu, an IT employee who desires a settled and mature life partner.',
    poster_url: '/posters/premalu-love-in-hyderabad.jpg',
    is_web_series: false,
    view_count: 10300,
    destinations: [
      { label: 'Download 1080p HQ [1.8 GB]', url: 'https://archive.org/download/sample_premalu_1080p' },
    ],
  },
  {
    title: 'The Goat Life (Aadujeevitham)',
    release_year: 2024,
    language: 'Malayalam',
    genre: ['Adventure', 'Biography', 'Drama'],
    category: 'Movie',
    quality: '1080p HDRip',
    file_size: '2.7 GB',
    description: 'Based on the true story of Najeeb, an Indian migrant worker deceived into forced isolated slave labor herding goats across the blistering dunes of the Saudi Arabian desert.',
    poster_url: '/posters/the-goat-life-aadujeevitham.jpg',
    is_web_series: false,
    view_count: 11900,
    destinations: [
      { label: 'Download 1080p [2.7 GB]', url: 'https://archive.org/download/sample_aadujeevitham_1080p' },
    ],
  },
  {
    title: '12th Fail',
    release_year: 2023,
    language: 'Hindi',
    genre: ['Biography', 'Drama'],
    category: 'Movie',
    quality: '1080p Clean HDRip',
    file_size: '1.9 GB',
    description: 'Based on the true life of IPS officer Manoj Kumar Sharma, who overcomes extreme poverty, academic failure, and menial odd jobs in Delhi to crack the UPSC civil services exam.',
    poster_url: '/posters/12th-fail-reboot.jpg',
    is_web_series: false,
    view_count: 14100,
    destinations: [
      { label: 'Download 1080p Clean [1.9 GB]', url: 'https://archive.org/download/sample_12thfail_1080p' },
    ],
  },
  {
    title: 'Farzi: Season 1',
    release_year: 2023,
    language: 'Hindi',
    genre: ['Crime', 'Drama', 'Thriller'],
    category: 'Web Series',
    quality: '1080p All Episodes [01-08]',
    file_size: '4.5 GB',
    description: 'Sunny, a brilliant but disillusioned street artist, designs the ultimate counterfeit Indian currency note, drawing the relentless pursuit of an eccentric task-force officer.',
    poster_url: '/posters/farzi-season-1.jpg',
    is_web_series: true,
    view_count: 12800,
    destinations: [
      { label: 'Download Season 1 [4.5 GB]', url: 'https://archive.org/download/sample_farzi_season1' },
    ],
  },
  {
    title: 'The Greatest of All Time (GOAT)',
    release_year: 2024,
    language: 'Tamil',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    category: 'Movie',
    quality: '1080p WEB-DL - DD+5.1',
    file_size: '2.9 GB',
    description: 'Gandhi, an elite operative of the Special Anti-Terrorist Squad, is haunted by a botched mission in Thailand that led to his young son’s death, until dark secrets re-emerge years later.',
    poster_url: '/posters/the-greatest-of-all-time-goat.jpg',
    is_web_series: false,
    view_count: 12200,
    destinations: [
      { label: 'Download 1080p WEB-DL [2.9 GB]', url: 'https://archive.org/download/sample_goat_1080p' },
    ],
  },
];

export async function seedDatabase(): Promise<{
  success: boolean;
  inserted: number;
  message: string;
}> {
  try {
    const supabase = createAdminClient();

    let inserted = 0;
    for (const item of SAMPLE_MOVIES) {
      const slug = slugify(item.title);

      const { data: movie, error: movieError } = await supabase
        .from('movies')
        .upsert(
          {
            title: item.title,
            slug,
            description: item.description,
            poster_url: item.poster_url,
            release_year: item.release_year,
            language: item.language,
            genre: item.genre,
            category: item.category,
            quality: item.quality,
            file_size: item.file_size,
            is_web_series: item.is_web_series,
            view_count: item.view_count,
            published_at: new Date().toISOString(),
            last_synced_at: new Date().toISOString(),
          },
          { onConflict: 'slug' }
        )
        .select()
        .single();

      if (movieError) {
        console.error('Error inserting movie:', item.title, movieError);
        continue;
      }

      if (movie && item.destinations.length > 0) {
        for (const dest of item.destinations) {
          await supabase.from('destinations').insert({
            movie_id: movie.id,
            label: dest.label,
            original_url: dest.url,
          });
        }
      }

      inserted++;
    }

    return {
      success: true,
      inserted,
      message: `Successfully seeded ${inserted} real movies with posters!`,
    };
  } catch (err) {
    console.error('Seed database error:', err);
    return {
      success: false,
      inserted: 0,
      message: err instanceof Error ? err.message : 'Unknown seed error',
    };
  }
}

export const seedDemoData = seedDatabase;

