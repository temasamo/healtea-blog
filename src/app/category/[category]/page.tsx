import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { Metadata } from 'next';

const TeaLeaf = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="16" rx="8" ry="14" fill="#8b7355" opacity="0.8" />
    <path d="M16 30C16 20 16 10 16 2" stroke="#a67c52" strokeWidth="1.5" />
  </svg>
);

// カテゴリー名とスラッグのマッピング
const categorySlugMap: { [key: string]: string } = {
  'japanese-tea': '日本茶',
  'japanese-food': '日本の食べ物',
  'health': '健康関連',
  'omotenashi': 'おもてなし',
  'japanese-agriculture': '日本の農業',
  'travelers': 'travelers'
};

const categoryNameMap: { [key: string]: string } = {
  '日本茶': 'japanese-tea',
  '日本の食べ物': 'japanese-food',
  '健康関連': 'health',
  'おもてなし': 'omotenashi',
  '日本の農業': 'japanese-agriculture',
  'travelers': 'travelers'
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  try {
    const { category: categorySlug } = await params;
    const categoryName = categorySlugMap[categorySlug] || categorySlug;
    return {
      title: `${categoryName} - HealTea`,
      description: `${categoryName}に関する記事一覧`,
    };
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    return {
      title: 'カテゴリー - HealTea',
      description: 'カテゴリー別記事一覧',
    };
  }
}

export async function generateStaticParams() {
  return Object.keys(categorySlugMap).map((slug) => ({
    category: slug,
  }));
}

// サブディレクトリ内のファイルも含めて取得する関数
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);
  
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      arrayOfFiles.push(fullPath);
    }
  });
  
  return arrayOfFiles;
}

function getPostsByCategory(categoryName: string, currentLang: string) {
  try {
    console.log('Looking for posts in category:', categoryName);
    console.log('Current language:', currentLang);
    const blogDir = path.join(process.cwd(), 'src/content/blog');
    const allFiles = getAllFiles(blogDir);
    console.log('Total files found:', allFiles.length);
    
    const posts = allFiles
      .map((filePath) => {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        
        // ファイル名からslugを生成（パスを含む）
        const relativePath = path.relative(blogDir, filePath);
        const slug = relativePath.replace(/\.md$/, '').replace(/\.mdx$/, '');
        
        return {
          slug,
          title: data.title,
          date: data.date,
          description: data.description,
          image: data.image,
          categories: data.categories || [],
          tags: data.tags || [],
          lang: data.lang || 'ja',
        };
      })
      .filter((post) => {
        const hasCategory = post.categories.includes(categoryName);
        const hasCorrectLang = currentLang === 'en' ? post.lang === 'en' : post.lang !== 'en';
        console.log(`Post ${post.slug}: categories=${post.categories}, hasCategory=${hasCategory}, lang=${post.lang}, hasCorrectLang=${hasCorrectLang}`);
        return hasCategory && hasCorrectLang;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`Found ${posts.length} posts for category: ${categoryName}`);
    return posts;
  } catch (error) {
    console.error('Error getting posts by category:', error);
    return [];
  }
}

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let categoryName = '';
  let posts: any[] = [];
  let error = null;

  // 言語パラメータを取得
  const paramsData = await params;
  const searchParamsData = await searchParams;
  const langParam = searchParamsData.lang;
  const currentLang = langParam === 'en' ? 'en' : langParam === 'ko' ? 'ko' : langParam === 'tw' ? 'tw' : langParam === 'hk' ? 'hk' : 'ja';

  // 記事のタイトルと説明文の多言語翻訳データ
  const postTranslations: { [key: string]: { [key: string]: { title: string; description: string } } } = {
    'about-japanesetea/2025-07-29-nihoncha-history': {
      en: {
        title: 'History of Japanese Tea: Where Did Tea Come From?',
        description: 'An easy-to-understand introduction to the history of Japanese tea from the Heian period to modern times.'
      },
      ko: {
        title: '일본차의 역사: 차는 어디서 왔을까?',
        description: '헤이안 시대부터 현대까지 일본차의 역사를 쉽게 이해할 수 있도록 소개합니다.'
      },
      tw: {
        title: '日本茶歷史：茶葉從何而來？',
        description: '從平安時代到現代，日本茶歷史的易懂介紹。'
      },
      hk: {
        title: '日本茶歷史：茶葉從何而來？',
        description: '從平安時代到現代，日本茶歷史的易懂介紹。'
      }
    },
    'about-japanesetea/2025-07-30-tea-cultivation-process': {
      en: {
        title: 'Japanese Tea Cultivation Process: From Seed to Cup',
        description: 'Learn about the traditional cultivation methods that create the unique flavor of Japanese tea.'
      },
      ko: {
        title: '일본차 재배 과정: 씨앗에서 잔까지',
        description: '일본차의 독특한 맛을 만드는 전통 재배 방법에 대해 알아봅니다.'
      },
      tw: {
        title: '日本茶栽培過程：從種子到茶杯',
        description: '了解創造日本茶獨特風味的傳統栽培方法。'
      },
      hk: {
        title: '日本茶栽培過程：從種子到茶杯',
        description: '了解創造日本茶獨特風味的傳統栽培方法。'
      }
    },
    'about-japanesetea/2025-07-31-tea-health-benefits': {
      en: {
        title: 'Japanese Tea and Health Benefits: What Science Says',
        description: 'Scientific research on the health benefits of Japanese tea and its active ingredients.'
      },
      ko: {
        title: '일본차와 건강 효과: 과학이 말하는 것',
        description: '일본차의 건강 효과와 활성 성분에 대한 과학적 연구.'
      },
      tw: {
        title: '日本茶與健康效益：科學怎麼說',
        description: '關於日本茶健康效益和活性成分的科學研究。'
      },
      hk: {
        title: '日本茶與健康效益：科學怎麼說',
        description: '關於日本茶健康效益和活性成分的科學研究。'
      }
    },
    'about-japanesetea/2025-08-01-tea-flavor-water': {
      en: {
        title: 'Where Does Japanese Tea\'s Deliciousness Come From? The Secret of Taste, Aroma, and Water',
        description: 'What determines the deliciousness of Japanese tea is not just the tea leaves. Taste, aroma, water...'
      },
      ko: {
        title: '일본차의 맛은 어디서 오는가? 맛, 향, 물의 비밀',
        description: '일본차의 맛을 결정하는 것은 차잎만이 아닙니다. 맛, 향, 물...'
      },
      tw: {
        title: '日本茶的美味從何而來？味道、香氣、水的秘密',
        description: '決定日本茶美味的因素不只是茶葉。味道、香氣、水...'
      },
      hk: {
        title: '日本茶的美味從何而來？味道、香氣、水的秘密',
        description: '決定日本茶美味的因素不只是茶葉。味道、香氣、水...'
      }
    },
    'health/2025-07-29-green-tea-health-benefits': {
      en: {
        title: 'Nutritional Components in Green Tea and Their Amazing Health Effects',
        description: 'Explanation of the main components in Japanese tea and their health impacts.'
      },
      ko: {
        title: '녹차에 함유된 영양 성분과 놀라운 건강 효과',
        description: '일본차에 함유된 주요 성분과 건강에 미치는 영향에 대한 설명.'
      },
      tw: {
        title: '綠茶中的營養成分及其驚人的健康效果',
        description: '日本茶中主要成分及其對健康影響的說明。'
      },
      hk: {
        title: '綠茶中的營養成分及其驚人的健康效果',
        description: '日本茶中主要成分及其對健康影響的說明。'
      }
    },
    'health/2025-07-31-green-tea-coffee-tea-comparison': {
      en: {
        title: 'Green Tea vs Coffee: Which is Better for Your Health?',
        description: 'A detailed comparison of the health benefits of green tea and coffee.'
      },
      ko: {
        title: '녹차 vs 커피: 건강에 더 좋은 것은?',
        description: '녹차와 커피의 건강 효과에 대한 상세한 비교.'
      },
      tw: {
        title: '綠茶 vs 咖啡：哪個對健康更好？',
        description: '綠茶和咖啡健康效益的詳細比較。'
      },
      hk: {
        title: '綠茶 vs 咖啡：哪個對健康更好？',
        description: '綠茶和咖啡健康效益的詳細比較。'
      }
    },
    'health/2025-08-01-tea-components-health': {
      en: {
        title: 'What? Easily Explain Catechins, Theanine, Caffeine',
        description: 'The ingredients contained in Japanese tea, how they work...'
      },
      ko: {
        title: '뭐? 쉽게 설명하는 카테킨, 테아닌, 카페인',
        description: '일본차에 함유된 성분, 그들이 어떻게 작용하는지...'
      },
      tw: {
        title: '什麼？輕鬆解釋兒茶素、茶胺酸、咖啡因',
        description: '日本茶所含的成分，它們如何作用...'
      },
      hk: {
        title: '什麼？輕鬆解釋兒茶素、茶胺酸、咖啡因',
        description: '日本茶所含的成分，它們如何作用...'
      }
    },
    'health/medical/2025-08-01-summer-health-topics': {
      en: {
        title: 'Heatstroke 2025 Latest Prevention Methods and First Aid Guide',
        description: 'About the latest prevention methods and emergency first aid for heatstroke you should know in the summer of 2025...'
      },
      ko: {
        title: '열중증 2025 최신 예방법과 응급처치 가이드',
        description: '2025년 여름에 알아야 할 열중증의 최신 예방 방법과 응급 처치에 대해...'
      },
      tw: {
        title: '中暑2025最新預防方法和急救指南',
        description: '關於2025年夏天你應該知道的中暑最新預防方法和緊急急救...'
      },
      hk: {
        title: '中暑2025最新預防方法和急救指南',
        description: '關於2025年夏天你應該知道的中暑最新預防方法和緊急急救...'
      }
    },
    'omotenasi/2025-07-29-omotenashi-history': {
      en: {
        title: 'The History of Omotenashi: The Spirit of Japanese Hospitality',
        description: 'Exploring the origins and evolution of Japanese hospitality culture from ancient times to the present.'
      },
      ko: {
        title: '오모테나시의 역사: 일본의 환대 정신',
        description: '고대부터 현재까지 일본 환대 문화의 기원과 발전을 탐구합니다.'
      },
      tw: {
        title: '款待文化的歷史：日本待客之道的精神',
        description: '探索從古代到現代的日本款待文化起源和演變。'
      },
      hk: {
        title: '款待文化的歷史：日本待客之道的精神',
        description: '探索從古代到現代的日本款待文化起源和演變。'
      }
    },
    'omotenasi/2025-07-31-ryokan-omotenashi': {
      en: {
        title: 'Ryokan Culture and Omotenashi',
        description: 'What is the spirit of Omotenashi that breathes in Japanese ryokans? Through its history, hospitality style, and meticulous care, Japanese culture...'
      },
      ko: {
        title: '료칸 문화와 오모테나시',
        description: '일본 료칸에 숨쉬는 오모테나시의 정신은 무엇일까요? 그 역사, 접객 스타일, 세심한 배려를 통해 일본 문화...'
      },
      tw: {
        title: '旅館文化與款待之道',
        description: '什麼是日本旅館中體現的款待精神？通過其歷史、待客風格和細緻關懷，日本文化...'
      },
      hk: {
        title: '旅館文化與款待之道',
        description: '什麼是日本旅館中體現的款待精神？通過其歷史、待客風格和細緻關懷，日本文化...'
      }
    },
    'omotenasi/2025-08-01-ryokan-onsen': {
      en: {
        title: 'Ryokan and Onsen: The Healing and Hospitality of Japanese Culture',
        description: 'Introduces the history of hot springs and ryokans, famous hot spring areas nationwide, and hot spring legends and festivals that also fascinate foreigners.'
      },
      ko: {
        title: '료칸과 온천: 일본 문화의 치유와 환대',
        description: '온천과 료칸의 역사, 전국의 유명 온천지, 그리고 외국인들도 매료시키는 온천 전설과 축제를 소개합니다.'
      },
      tw: {
        title: '旅館與溫泉：日本文化的療癒與款待',
        description: '介紹溫泉和旅館的歷史、全國著名溫泉地，以及讓外國人也著迷的溫泉傳說和節慶。'
      },
      hk: {
        title: '旅館與溫泉：日本文化的療癒與款待',
        description: '介紹溫泉和旅館的歷史、全國著名溫泉地，以及讓外國人也著迷的溫泉傳說和節慶。'
      }
    },
    'japanesefood/2025-07-29-japanese-food-part1': {
      en: {
        title: 'Japanese Food Culture: Traditional Dishes and Their Stories',
        description: 'Exploring the rich history and cultural significance of traditional Japanese cuisine.'
      },
      ko: {
        title: '일본 음식 문화: 전통 요리와 그 이야기',
        description: '전통 일본 요리의 풍부한 역사와 문화적 의미를 탐구합니다.'
      },
      tw: {
        title: '日本飲食文化：傳統料理與其故事',
        description: '探索傳統日本料理的豐富歷史和文化意義。'
      },
      hk: {
        title: '日本飲食文化：傳統料理與其故事',
        description: '探索傳統日本料理的豐富歷史和文化意義。'
      }
    },
    'japanesefood/2025-07-29-japanese-food-part2': {
      en: {
        title: 'Seasonal Japanese Cuisine: The Art of Seasonal Ingredients',
        description: 'Discover how Japanese cuisine celebrates the changing seasons through carefully selected ingredients.'
      },
      ko: {
        title: '계절 일본 요리: 계절 재료의 예술',
        description: '일본 요리가 신중하게 선택된 재료를 통해 변화하는 계절을 어떻게 축하하는지 발견하세요.'
      },
      tw: {
        title: '季節日本料理：時令食材的藝術',
        description: '發現日本料理如何通過精心挑選的食材來慶祝季節變化。'
      },
      hk: {
        title: '季節日本料理：時令食材的藝術',
        description: '發現日本料理如何通過精心挑選的食材來慶祝季節變化。'
      }
    },
    'japanesefood/2025-07-29-japanese-food-part3': {
      en: {
        title: 'Modern Japanese Food: Fusion and Innovation',
        description: 'How traditional Japanese cuisine evolves and adapts in the modern world.'
      },
      ko: {
        title: '현대 일본 음식: 퓨전과 혁신',
        description: '전통 일본 요리가 현대 세계에서 어떻게 진화하고 적응하는지.'
      },
      tw: {
        title: '現代日本料理：融合與創新',
        description: '傳統日本料理如何在現代世界中演變和適應。'
      },
      hk: {
        title: '現代日本料理：融合與創新',
        description: '傳統日本料理如何在現代世界中演變和適應。'
      }
    },
    'travelers/2025-07-29-nihoncha-history-en': {
      en: {
        title: 'History of Japanese Tea: Where Did Tea Come From?',
        description: 'An easy-to-understand introduction to the history of Japanese tea from the Heian period to modern times.'
      },
      ko: {
        title: '일본차의 역사: 차는 어디서 왔을까?',
        description: '헤이안 시대부터 현대까지 일본차의 역사를 쉽게 이해할 수 있도록 소개합니다.'
      },
      tw: {
        title: '日本茶歷史：茶葉從何而來？',
        description: '從平安時代到現代，日本茶歷史的易懂介紹。'
      },
      hk: {
        title: '日本茶歷史：茶葉從何而來？',
        description: '從平安時代到現代，日本茶歷史的易懂介紹。'
      }
    },
    'travelers/2025-07-31-ryokan-onsen-en': {
      en: {
        title: 'Onsen Legends and Festival Culture: Japanese Stories That Fascinate Foreigners',
        description: 'Introducing the mystical legends of hot spring areas across Japan and the festival culture nurtured...'
      },
      ko: {
        title: '온천 전설과 축제 문화: 외국인들을 매료시키는 일본 이야기',
        description: '일본 전국의 온천지의 신비로운 전설과 축제 문화를 소개...'
      },
      tw: {
        title: '溫泉傳說與節慶文化：讓外國人著迷的日本故事',
        description: '介紹日本全國溫泉地的神秘傳說和孕育的節慶文化...'
      },
      hk: {
        title: '溫泉傳說與節慶文化：讓外國人著迷的日本故事',
        description: '介紹日本全國溫泉地的神秘傳說和孕育的節慶文化...'
      }
    }
  };

  // タグの翻訳データ
  const tagTranslations: { [key: string]: { [key: string]: string } } = {
    '日本茶': { en: 'Japanese Tea', ko: '일본차', tw: '日本茶', hk: '日本茶' },
    '歴史': { en: 'History', ko: '역사', tw: '歷史', hk: '歷史' },
    '健康': { en: 'Health', ko: '건강', tw: '健康', hk: '健康' },
    '栄養': { en: 'Nutrition', ko: '영양', tw: '營養', hk: '營養' },
    '予防医学': { en: 'Preventive Medicine', ko: '예방의학', tw: '預防醫學', hk: '預防醫學' },
    '緑茶': { en: 'Green Tea', ko: '녹차', tw: '綠茶', hk: '綠茶' },
    'カフェイン': { en: 'Caffeine', ko: '카페인', tw: '咖啡因', hk: '咖啡因' },
    '茶道': { en: 'Tea Ceremony', ko: '다도', tw: '茶道', hk: '茶道' },
    '栽培': { en: 'Cultivation', ko: '재배', tw: '栽培', hk: '栽培' },
    '成分': { en: 'Components', ko: '성분', tw: '成分', hk: '成分' },
    '味': { en: 'Taste', ko: '맛', tw: '味道', hk: '味道' },
    '香り': { en: 'Aroma', ko: '향', tw: '香氣', hk: '香氣' },
    '水': { en: 'Water', ko: '물', tw: '水', hk: '水' },
    'お茶の淹れ方': { en: 'Tea Brewing', ko: '차 우려내기', tw: '泡茶方法', hk: '泡茶方法' },
    '熱中症': { en: 'Heatstroke', ko: '열중증', tw: '中暑', hk: '中暑' },
    '旅館': { en: 'Ryokan', ko: '료칸', tw: '旅館', hk: '旅館' },
    '温泉': { en: 'Hot Spring', ko: '온천', tw: '溫泉', hk: '溫泉' },
    '観光': { en: 'Tourism', ko: '관광', tw: '觀光', hk: '觀光' },
    'おもてなし': { en: 'Omotenashi', ko: '오모테나시', tw: '款待', hk: '款待' },
    '日本料理': { en: 'Japanese Cuisine', ko: '일본 요리', tw: '日本料理', hk: '日本料理' },
    '伝統': { en: 'Traditional', ko: '전통', tw: '傳統', hk: '傳統' },
    '文化': { en: 'Culture', ko: '문화', tw: '文化', hk: '文化' },
    '季節': { en: 'Seasonal', ko: '계절', tw: '季節', hk: '季節' },
    '食材': { en: 'Ingredients', ko: '재료', tw: '食材', hk: '食材' },
    '現代': { en: 'Modern', ko: '현대', tw: '現代', hk: '現代' },
    '融合': { en: 'Fusion', ko: '퓨전', tw: '融合', hk: '融合' },
    '革新': { en: 'Innovation', ko: '혁신', tw: '革新', hk: '革新' },
    'onsen': { en: 'Onsen', ko: '온천', tw: '溫泉', hk: '溫泉' },
    'tourism': { en: 'Tourism', ko: '관광', tw: '觀光', hk: '觀光' },
    'omotenashi': { en: 'Omotenashi', ko: '오모테나시', tw: '款待', hk: '款待' },
    'legends': { en: 'Legends', ko: '전설', tw: '傳說', hk: '傳說' },
    'festivals': { en: 'Festivals', ko: '축제', tw: '節慶', hk: '節慶' },
    'japanese tea': { en: 'Japanese Tea', ko: '일본차', tw: '日本茶', hk: '日本茶' },
    'history': { en: 'History', ko: '역사', tw: '歷史', hk: '歷史' },
    'tea ceremony': { en: 'Tea Ceremony', ko: '다도', tw: '茶道', hk: '茶道' },
    'culture': { en: 'Culture', ko: '문화', tw: '文化', hk: '文化' }
  };

  // カテゴリの多言語翻訳データ
  const categoryTranslations: { [key: string]: { [key: string]: string } } = {
    '日本茶': { en: 'Japanese Tea', ko: '일본차', tw: '日本茶', hk: '日本茶' },
    '日本の食べ物': { en: 'Japanese Food', ko: '일본 음식', tw: '日本料理', hk: '日本料理' },
    '健康関連': { en: 'Health & Wellness', ko: '건강 관련', tw: '健康相關', hk: '健康相關' },
    'おもてなし': { en: 'Omotenashi', ko: '오모테나시', tw: '款待', hk: '款待' },
    '日本の農業': { en: 'Japanese Agriculture', ko: '일본 농업', tw: '日本農業', hk: '日本農業' },
    '日本への旅行者へ': { en: 'For Travelers', ko: '여행자를 위해', tw: '給旅行者', hk: '給旅行者' }
  };

  try {
    const { category: categorySlug } = await params;
    console.log('Category slug:', categorySlug);
    
    // スラッグからカテゴリー名を取得
    categoryName = categorySlugMap[categorySlug] || categorySlug;
    console.log('Category name:', categoryName);
    
    posts = getPostsByCategory(categoryName, currentLang);
  } catch (error) {
    console.error('Error in CategoryPage:', error);
    categoryName = 'カテゴリー';
    posts = [];
    error = error;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-[#f8f6f3] to-[#f5f2ed] text-[#2c2c2c]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#d4c4a8]/30 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 flex justify-center items-center h-24 gap-8">
          <TeaLeaf />
          <span className="text-5xl font-light tracking-[0.3em] text-center teaver-heading">HealTea</span>
          <TeaLeaf />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <Link href={currentLang !== 'ja' ? `/?lang=${currentLang}` : "/"} className="inline-block text-[#8b7355] hover:text-[#a67c52] font-medium text-base transition-colors px-3 py-2 rounded-full hover:bg-[#f3f4f6] teaver-text">
            ← {currentLang === 'en' ? 'Back to Home' : 
                currentLang === 'ko' ? '홈으로 돌아가기' :
                currentLang === 'tw' ? '返回首頁' :
                currentLang === 'hk' ? '返回首頁' :
                'ホームへ戻る'}
          </Link>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-16 tracking-[0.15em] teaver-heading">
          {categoryName === '日本への旅行者へ' && currentLang === 'en' ? 'For Travelers to Japan' :
           categoryName === '日本への旅行者へ' && currentLang === 'ko' ? '일본 여행자를 위해' :
           categoryName === '日本への旅行者へ' && currentLang === 'tw' ? '給日本旅行者' :
           categoryName === '日本への旅行者へ' && currentLang === 'hk' ? '給日本旅行者' :
           categoryName}
        </h1>
        
        {error && (
          <div className="text-center py-8 mb-8 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">エラーが発生しました: {String(error)}</p>
          </div>
        )}
        
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#6b7280] text-xl teaver-text">
              {currentLang === 'en' ? 'No articles in this category yet.' :
               currentLang === 'ko' ? '이 카테고리의 기사가 아직 없습니다.' :
               currentLang === 'tw' ? '此分類尚無文章。' :
               currentLang === 'hk' ? '此分類尚無文章。' :
               'このカテゴリーの記事はまだありません。'}
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.slug} className="teaver-card rounded-2xl overflow-hidden h-full">
                <div className="p-8">
                  <h2 className="text-xl font-medium mb-3 teaver-heading leading-relaxed">
                    {currentLang !== 'ja' && postTranslations[post.slug]?.[currentLang]?.title 
                      ? postTranslations[post.slug][currentLang].title 
                      : post.title}
                  </h2>
                  <p className="text-[#9ca3af] text-sm mb-4">{post.date}</p>
                  <p className="text-[#6b7280] mb-6 teaver-text line-clamp-3">
                    {currentLang !== 'ja' && postTranslations[post.slug]?.[currentLang]?.description 
                      ? postTranslations[post.slug][currentLang].description 
                      : post.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.categories && Array.isArray(post.categories) && post.categories.map((category: string) => (
                      <span key={category} className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                        {currentLang !== 'ja' && categoryTranslations[category]?.[currentLang] 
                          ? categoryTranslations[category][currentLang] 
                          : category}
                      </span>
                    ))}
                    {post.tags && Array.isArray(post.tags) && post.tags.map((tag: string) => (
                      <span key={tag} className="bg-[#f3f4f6] text-[#6b7280] text-xs px-3 py-1 rounded-full">
                        {currentLang !== 'ja' && tagTranslations[tag]?.[currentLang] 
                          ? tagTranslations[tag][currentLang] 
                          : tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="teaver-button text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 w-full text-center inline-block">
                    {currentLang === 'en' ? 'Read More' : 
                     currentLang === 'ko' ? '더 보기' :
                     currentLang === 'tw' ? '閱讀更多' :
                     currentLang === 'hk' ? '閱讀更多' :
                     '続きを読む'}
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-[#d4c4a8]/30 py-12 mt-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[#9ca3af] text-sm teaver-text">&copy; 2025 HealTea. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 