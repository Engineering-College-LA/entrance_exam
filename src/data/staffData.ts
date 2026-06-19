type StaffMember = {
  id: string
  slug: string
  full_name_en: string
  full_name_ru: string
  role_en: string
  role_ru: string
  bio_en: string
  bio_ru: string
  department: string
  photo_url: string | null
  sort_order: number
  published: boolean
}

// Source: Website_Information.zip → "Faculty and Staff/Bio For Teachers.docx"
// (polished, publish-ready bios). One entry (eldar-ulanov) only existed in the
// longer "Bio (1).docx" in first-person form and was lightly rewritten to
// third person here to match the others' tone.
//
// photo_url is null for everyone: the supplied photos (Faculty and Staff/UEC/*.JPG)
// are camera filenames (e.g. _DSC0090.JPG) with no name mapping — they need to be
// manually matched to a person, renamed to the matching slug, and uploaded to the
// `staff-photos` Storage bucket (see supabase/sql/staff_members_full_setup.sql)
// before this field can be filled in.

export const STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'aibek-doolos',
    slug: 'aibek-doolos',
    full_name_en: 'Aibek Doolos',
    full_name_ru: 'Доолос Айбек',
    role_en: 'Vice Principal for Academic Affairs, Cybersecurity Instructor',
    role_ru: 'Заведующий учебной частью, преподаватель кибербезопасности',
    bio_en:
      'Aibek Doolos holds a PhD in Electrical and Computer Engineering (KAUST), an MSc in Materials Science and Nanotechnology (Bilkent University), and a BSc in Physics (METU). He has experience teaching engineering disciplines at both college and university levels. At the Engineering College, he oversees academic quality and development, teaches cybersecurity, and prepares students for the SAT. Previously, he served as an Assistant Professor at the University of Central Asia (UCA), contributing to curriculum design. His research in antennas and electromagnetics has been published in IEEE Transactions on Antennas and Propagation, and he has presented at international conferences. He focuses on developing students\u2019 analytical thinking and practical skills for real-world engineering challenges.',
    bio_ru:
      'Доолос Айбек — PhD в области электротехники и компьютерной инженерии (KAUST), магистр материаловедения и нанотехнологий (Bilkent University), бакалавр физики (METU). Имеет опыт преподавания инженерных дисциплин на уровне колледжа и университета. В Инженерном колледже отвечает за академическое развитие и качество обучения, преподаёт кибербезопасность и готовит студентов к экзамену SAT. Ранее — ассистент-профессор в Университете Центральной Азии (UCA), где участвовал в разработке учебных программ. Автор научных публикаций в IEEE Transactions on Antennas and Propagation, участник международных конференций в области антенн и электромагнитики. Фокусируется на развитии аналитического мышления и практических навыков, готовя студентов к требованиям современной инженерии.',
    department: 'Academic Affairs / Cybersecurity',
    photo_url: null,
    sort_order: 1,
    published: true,
  },
  {
    id: 'nurzhan-beksultanova',
    slug: 'nurzhan-beksultanova',
    full_name_en: 'Nurzhan Beksultanova',
    full_name_ru: 'Нуржан Бексултанова',
    role_en: 'Chemistry Instructor',
    role_ru: 'Преподаватель химии',
    bio_en:
      'Nurzhan Beksultanova holds a PhD in Chemistry from Middle East Technical University (METU), where she also completed her MSc and BSc in Chemistry. She has extensive experience in academic and research environments. She worked as a Teaching Assistant at METU (Ankara, Turkey), supporting students at different stages — from early coursework to graduation. She develops course materials, helps students understand complex topics, and provides academic support. She has also been involved in organizing international scientific conferences. She is an author and co-author of publications in international journals and has experience reviewing scientific papers. She has participated in research projects focused on advancing modern methods in chemistry. She is dedicated to clear explanations of complex concepts, a student-centered approach, and fostering academic growth.',
    bio_ru:
      'Нуржан Бексултанова — PhD в области химии (Middle East Technical University, METU), где также окончила магистратуру и бакалавриат по химии. Имеет значительный опыт работы в академической среде. Работала ассистентом профессора в METU (Анкара, Турция), преподавала и сопровождала студентов разных уровней — от начальных курсов до выпускников. Разрабатывает учебные материалы, помогает в освоении сложных тем и оказывает академическую поддержку. Также участвовала в организации международных научных конференций. Автор и соавтор научных публикаций в международных журналах, имеет опыт рецензирования научных статей. Участвовала в исследовательских проектах, направленных на развитие современных методов в химии. Фокусируется на понятном объяснении сложных тем, внимательном подходе к студентам и развитии их академического потенциала.',
    department: 'Sciences / Chemistry',
    photo_url: null,
    sort_order: 2,
    published: true,
  },
  {
    id: 'ramil-salikhar',
    slug: 'ramil-salikhar',
    full_name_en: 'Ramil Salikhar',
    full_name_ru: 'Рамиль Салихар',
    role_en: 'Instructor / Software Development Specialist',
    role_ru: 'Преподаватель / Специалист по разработке ПО',
    bio_en:
      'Ramil Salikhar holds a Bachelor\u2019s degree in Computer Science from the University of Central Asia. He has over 3 years of commercial experience in mobile application development. He has worked with Kloop Media Foundation, ABN, and HelloIT, and is a co-founder of APRD, an IT company focused on software development and research. He also has academic experience, having contributed as a teaching assistant to research on school development in Naryn. He is actively involved in startups and developer communities. He participated in international competitions (IPHO 2019, ICPC NERC Finals 2022) and founded Dev Club, a community focused on building real-world projects. He focuses on hands-on learning, developing engineering thinking, and preparing students for real industry challenges.',
    bio_ru:
      'Рамиль Салихар — выпускник Университета Центральной Азии по специальности «Компьютерные науки». Имеет более 3 лет коммерческого опыта в разработке мобильных приложений. Работал в Kloop Media Foundation, ABN и HelloIT. Является сооснователем IT-компании APRD, занимающейся разработкой программного обеспечения и исследовательской деятельностью. Также имеет опыт академической работы — участвовал в исследовании развития школьников в Нарыне в роли ассистента профессора. Активно развивает стартап-проекты и профессиональные сообщества. Участвовал в международных соревнованиях (IPHO 2019, ICPC NERC Finals 2022), основал Dev Club — сообщество разработчиков, ориентированное на создание коммерческих проектов. Фокусируется на практическом обучении, развитии инженерного мышления и подготовке студентов к реальным задачам индустрии.',
    department: 'Software Engineering',
    photo_url: null,
    sort_order: 3,
    published: true,
  },
  {
    id: 'zhibek-alykulova',
    slug: 'zhibek-alykulova',
    full_name_en: 'Zhibek Alykulova',
    full_name_ru: 'Алыкулова Жибек Эргешовна',
    role_en: 'Head of Management Program, Senior Lecturer',
    role_ru: 'Руководитель программы «Менеджмент», старший преподаватель',
    bio_en:
      'Zhibek Alykulova holds a Master\u2019s degree in Management. She has over 16 years of experience in education and management. At the Engineering College, she leads the Management program and teaches courses in her field. Her experience includes academic, methodological, organizational, and administrative work. She focuses on developing educational programs, organizing effective learning processes, and implementing modern teaching approaches. She is recognized for her strong leadership and organizational skills, attention to detail, and commitment to continuous professional development.',
    bio_ru:
      'Алыкулова Жибек Эргешовна имеет высшее образование и степень магистра по направлению «Менеджмент». Обладает более чем 16-летним опытом работы в сфере образования и управления. В Инженерном колледже руководит программой «Менеджмент» и ведёт преподавательскую деятельность. Имеет опыт учебной, методической, организационной и административной работы. Фокусируется на развитии образовательных программ, эффективной организации учебного процесса и внедрении современных образовательных технологий. Отличается сильными лидерскими и организационными качествами, вниманием к деталям и стремлением к постоянному профессиональному развитию.',
    department: 'Management',
    photo_url: null,
    sort_order: 4,
    published: true,
  },
  {
    id: 'zumrad-uysal',
    slug: 'zumrad-uysal',
    full_name_en: 'Zumrad Uysal',
    full_name_ru: 'Зумрад Уйсал',
    role_en: 'English Language Instructor',
    role_ru: 'Преподаватель английского языка',
    bio_en:
      'Zumrad Uysal holds a Master of Arts in Teaching from AUCA and also completed her MA and BA in Romance and Germanic Philology at KGNU. She has over 25 years of experience in education. She worked within the international "Sapat" education system in various roles and taught English at Bishkek Lyceum Aichurek, Silk Road International School, and Chyngyz Aitmatov Lyceum. Since 2023, she has been teaching courses at the Faculty of Pedagogy at AUCA and worked as a teaching assistant. She focuses on developing students\u2019 language proficiency, academic skills, and overall educational growth. She is known for her responsibility, goal-oriented approach, and commitment to continuous professional development.',
    bio_ru:
      'Зумрад Уйсал — магистр педагогики (Master of Arts in Teaching, AUCA), также окончила магистратуру и бакалавриат на факультете романо-германской филологии КГНУ. Имеет более 25 лет опыта в сфере образования. Работала в международной образовательной системе «Сапат» на различных позициях, преподавала английский язык в Бишкекском лицее «Айчурек», Международной школе Silk Road и лицее имени Чынгыза Айтматова. С 2023 года преподавала на факультете педагогики в AUCA и работала ассистентом профессора. Фокусируется на развитии языковых навыков, академической подготовке и поддержке студентов в их образовательном пути. Отличается ответственным подходом к работе, стремлением к результату и постоянному профессиональному развитию.',
    department: 'English Language',
    photo_url: null,
    sort_order: 5,
    published: true,
  },
  {
    id: 'elbrus-tazhibaev',
    slug: 'elbrus-tazhibaev',
    full_name_en: 'Elbrus Tazhibaev',
    full_name_ru: 'Эльбрус Тажибаев',
    role_en: 'Biology Instructor',
    role_ru: 'Преподаватель биологии',
    bio_en:
      'Elbrus Tazhibaev holds a Bachelor\u2019s degree in Biological Sciences from Abant \u0130zzet Baysal University (Turkey) and a Master\u2019s degree in Microbiology from I. Arabaev Kyrgyz State University. He has over 12 years of experience teaching biology. For 12 years, he has been involved in training the Kyrgyz Republic\u2019s national biology team, including 6 years as Head Coach. Since 2025, he has been appointed Head Coach of the national chemistry team. He is the founder of OL Academy, an educational platform focused on preparing future scientists and medical professionals. He focuses on advanced academic training, developing scientific thinking, and helping students achieve high-level results.',
    bio_ru:
      'Эльбрус Тажибаев — бакалавр биологических наук (Abant İzzet Baysal University, Турция) и магистр микробиологии (КГУ им. И. Арабаева). Имеет более 12 лет опыта преподавания биологии. На протяжении 12 лет занимался подготовкой национальной сборной Кыргызской Республики по биологии, из них 6 лет — в роли главного тренера. С 2025 года назначен главным тренером национальной сборной КР по химии. Является руководителем OL Academy — образовательной платформы, готовящей будущих учёных и медицинских специалистов. Фокусируется на углублённой подготовке студентов, развитии научного мышления и достижении высоких академических результатов.',
    department: 'Sciences / Biology',
    photo_url: null,
    sort_order: 6,
    published: true,
  },
  {
    id: 'elnazar-ulanbek-uulu',
    slug: 'elnazar-ulanbek-uulu',
    full_name_en: 'Elnazar Ulanbek uulu',
    full_name_ru: 'Элназар Уланбек уулу',
    role_en: 'Instructor / Backend Developer',
    role_ru: 'Преподаватель / Backend-разработчик',
    bio_en:
      'Elnazar Ulanbek uulu is a computer science specialist with a strong academic and practical background in algorithms and system design. He has experience working in leading tech companies, including Yandex, where he contributed to maintaining and optimizing large-scale databases. He is a co-founder and CTO of APRD, leading architecture design for infrastructure and fintech projects. At the Engineering College, he teaches a database course. He is a two-time finalist of ICPC NERC and actively participates in the competitive programming community. He focuses on hands-on learning and bringing modern industry practices into education, preparing students for real-world backend development challenges.',
    bio_ru:
      'Элназар Уланбек уулу — специалист в области компьютерных наук с сильной академической и практической подготовкой в алгоритмах и проектировании систем. Имеет опыт работы в крупных технологических компаниях, включая Yandex, где занимался поддержкой и оптимизацией высоконагруженных баз данных. Является сооснователем и CTO IT-компании APRD, где руководит разработкой архитектуры для инфраструктурных и финтех-проектов. В Инженерном колледже ведёт курс по базам данных. Двукратный финалист ICPC NERC, активно участвует в сообществе спортивного программирования. Фокусируется на практическом обучении и передаче современных индустриальных стандартов, помогая студентам осваивать Backend-разработку через реальные инженерные задачи.',
    department: 'Software Engineering',
    photo_url: null,
    sort_order: 7,
    published: true,
  },
  {
    id: 'azamat-askarov',
    slug: 'azamat-askarov',
    full_name_en: 'Azamat Askarov',
    full_name_ru: 'Азамат Аскаров',
    role_en: 'Mathematics Instructor, Olympiad Coach',
    role_ru: 'Преподаватель математики, тренер по олимпиадной математике',
    bio_en:
      'Azamat Askarov graduated from the Faculty of Arts and Sciences at Middle East Technical University (METU) with a degree in Mathematics. He has over 10 years of experience in olympiad mathematics training. From 2015 to 2025, he served as Head Coach in the "Sapat" education system, preparing students for national and international competitions. He is the first representative of Kyrgyzstan to win a silver medal at the International Mathematical Olympiad (IMO 2010). At the Engineering College, he teaches mathematics and leads olympiad training programs. He founded a math club for grades 6\u201311 and also provides individual coaching. He focuses on developing strong logical thinking, deep mathematical understanding, and high-level academic performance.',
    bio_ru:
      'Азамат Аскаров — выпускник факультета искусств и наук Middle East Technical University (METU) по специальности «Математика». Обладает более чем 10-летним опытом подготовки к олимпиадной математике. С 2015 по 2025 годы работал главным тренером в образовательной системе «Сапат», где подготовил призёров республиканских и международных олимпиад. Является первым представителем Кыргызстана, завоевавшим серебряную медаль на International Mathematical Olympiad (IMO 2010). В Инженерном колледже ведёт занятия по математике и руководит олимпиадной подготовкой. Основал кружок для учащихся 6–11 классов и проводит индивидуальные занятия. Фокусируется на развитии логического мышления, глубоком понимании математики и подготовке студентов к высоким академическим достижениям.',
    department: 'Mathematics',
    photo_url: null,
    sort_order: 8,
    published: true,
  },
  {
    id: 'munara-bekbolotova',
    slug: 'munara-bekbolotova',
    full_name_en: 'Munara Bekbolotova',
    full_name_ru: 'Мунара Бекболотова',
    role_en: 'Psychologist, Career Guidance Specialist',
    role_ru: 'Психолог, специалист по профориентации',
    bio_en:
      'Munara Bekbolotova holds a Bachelor\u2019s degree in Psychology from Istanbul University. She continuously develops her expertise in psychology and career counseling. In her practice, she applies cognitive behavioral therapy (CBT), coaching methods, and modern career guidance tools. She is currently training in EMDR. She has over 9 years of professional experience, working in educational settings and psychological centers. She provides student support, career guidance, psychological assessment, developmental interventions, and consultation for parents and faculty. She specializes in adolescent psychology, soft skills development, and career orientation. Her work focuses on self-awareness, motivation, and helping students build sustainable academic and career paths using evidence-based approaches. She aims to create a supportive learning environment where each student\u2019s individual path is valued.',
    bio_ru:
      'Мунара Бекболотова — бакалавр психологии Istanbul University. Регулярно повышает квалификацию в области психологии и карьерного консультирования. В работе применяет методы когнитивно-поведенческой терапии (КПТ), коучинг и современные инструменты профориентации. В настоящее время обучается методу EMDR. Имеет более 9 лет профессионального опыта. Работала психологом в образовательной среде и психологическом центре. Осуществляет психологическое сопровождение студентов, занимается профориентацией, психодиагностикой, коррекционно-развивающей работой, а также консультирует родителей и преподавателей. Специализируется на подростковой психологии, развитии мягких навыков и профессиональном самоопределении. Стремится создавать поддерживающую образовательную среду, где учитывается индивидуальный путь каждого студента.',
    department: 'Student Affairs / Psychology',
    photo_url: null,
    sort_order: 9,
    published: true,
  },
  {
    id: 'jyldyz-biigeldieva',
    slug: 'jyldyz-biigeldieva',
    full_name_en: 'Jyldyz Biigeldieva',
    full_name_ru: 'Жылдыз Бийгелдиева',
    role_en: 'English Language Instructor',
    role_ru: 'Преподаватель английского языка',
    bio_en:
      'Jyldyz Biigeldieva is currently pursuing an M.A. in Curriculum & Instruction at North American University. She holds a Bachelor\u2019s degree in English Language and Literature from Alatoo International University, where she studied on a full scholarship, received a gold medal for academic excellence, and was awarded the Presidential Scholarship. She also studied at Berea College through the UGRAD exchange program. She has over 10 years of international teaching experience (Laos, Kyrgyzstan, USA). She worked at the International School of Laos, teaching Cambridge IGCSE courses, designing interactive lessons, and developing students\u2019 critical thinking and communication skills. She also led a Model United Nations team. She has completed international training programs (Cambridge CELTA, IGCSE, Oxford) and has expertise in curriculum development (IGCSE, ESL) and academic mentoring. She focuses on creating a supportive and engaging learning environment, fostering critical thinking, and developing students\u2019 language skills through a student-centered approach.',
    bio_ru:
      'Жылдыз Бийгелдиева — магистрант программы Curriculum & Instruction в North American University (США). Имеет степень бакалавра по английскому языку и литературе (Alatoo International University), где обучалась на полном гранте, была награждена золотой медалью и стипендией президента. Участвовала в программе обмена Berea College в рамках UGRAD. Имеет более 10 лет международного опыта преподавания (Лаос, Кыргызстан, США). Работала в International School of Laos, где преподавала по программе Cambridge IGCSE, разрабатывала интерактивные уроки и развивала навыки критического мышления и коммуникации. Руководила командой Model United Nations. Прошла международные тренинги (Cambridge CELTA, IGCSE, Oxford), обладает опытом разработки учебных программ (IGCSE, ESL) и академического наставничества. Фокусируется на создании мотивирующей среды, развитии критического мышления и языковых навыков через индивидуальный подход и активное вовлечение студентов.',
    department: 'English Language',
    photo_url: null,
    sort_order: 10,
    published: true,
  },
  {
    id: 'aizhamal-asan-kyzy',
    slug: 'aizhamal-asan-kyzy',
    full_name_en: 'Aizhamal Asan kyzy',
    full_name_ru: 'Асан кызы Айжамал',
    role_en: 'Parent Relations Coordinator',
    role_ru: 'Координатор по связям с родителями',
    bio_en:
      'Aizhamal Asan kyzy holds a Bachelor\u2019s degree in Textile Engineering from Marmara University and a Master\u2019s degree from I. Arabaev Kyrgyz State University. She has extensive experience in education and administration. She began her career in the "Sapat" education system and later served as Vice Principal for Student Affairs at "Kelechek MIT" IT School. At the Engineering College, she manages parent relations, ensuring effective communication between the institution and students\u2019 families. She specializes in building a supportive and trust-based educational environment, facilitating student adaptation, and handling complex communication with care and professionalism. She follows the principles of humane education and a student-centered approach, strengthening the connection between the college, students, and parents.',
    bio_ru:
      'Асан кызы Айжамал получила высшее техническое образование в Marmara University по направлению «Инженер текстильной промышленности», а также степень магистра в Кыргызском государственном университете им. И. Арабаева. Имеет многолетний опыт работы в сфере образования и администрирования. Начала профессиональный путь в системе «Сапат», далее занимала должность завуча по воспитательной части в IT-школе «Келечек MIT». В Инженерном колледже отвечает за взаимодействие с родителями, обеспечивая эффективную коммуникацию между колледжем и семьями студентов. Специализируется на построении доверительной образовательной среды, поддержке студентов в процессе адаптации и решении сложных коммуникационных задач. Придерживается принципов гуманной педагогики и индивидуального подхода.',
    department: 'Student Affairs',
    photo_url: null,
    sort_order: 11,
    published: true,
  },
  {
    id: 'eldar-ulanov',
    slug: 'eldar-ulanov',
    full_name_en: 'Eldar Ulanov',
    full_name_ru: 'Элдар Уланов',
    role_en: 'COO & Project Manager, Computer Literacy Instructor',
    role_ru: 'COO и Project Manager, преподаватель Computer Literacy',
    // Note: source for this bio was the longer, first-person "Bio (1).docx"
    // (not present in "Bio For Teachers.docx") — lightly rewritten to third
    // person here for consistency with the rest of the data set.
    bio_en:
      'Eldar Ulanov is a COO and Project Manager with experience leading technical teams and developing digital products. He has managed projects in HealthTech, E-commerce, and Event platforms, delivering products under tight deadlines. He has worked with BookingLane and Caps Cargo, and is actively involved in building startups. He is a co-founder of APRD, an IT company focused on software development and research. Over his career he has managed more than 7 projects and successfully secured grant funding from government organizations and USAID. His core skills include product management, Agile/Scrum, requirements analysis, startup development, and building effective teams with a focus on team wellbeing. He holds a Bachelor\u2019s degree in Computer Science from the University of Central Asia, and has completed professional courses including Agile Project Management (Meta) and "Python with AI for Educators" (EPAM). At the Engineering College, he teaches Computer Literacy, helping students build a strong foundation in digital literacy and understand the role of technology in the modern world.',
    bio_ru:
      'Элдар Уланов — COO и Project Manager с опытом управления техническими командами и разработки цифровых продуктов. Руководил проектами в сферах HealthTech, E-commerce и Event-платформ, обеспечивая успешную доставку продуктов в сжатые сроки. Работал в компаниях BookingLane и Caps Cargo, активно занимается развитием стартапов. Сооснователь IT-компании APRD, специализирующейся на разработке программного обеспечения и исследовательской деятельности. За время карьеры управлял более чем 7 проектами и привлёк грантовое финансирование от государственных организаций и USAID. Ключевые компетенции: Product Management, Agile/Scrum, анализ требований, развитие стартапов и построение эффективных команд с акцентом на благополучие сотрудников. Получил степень бакалавра по специальности «Компьютерные науки» в Университете Центральной Азии, прошёл курсы Agile Project Management (Meta) и «Python с использованием ИИ для преподавателей» (EPAM). В Инженерном колледже преподаёт курс Computer Literacy.',
    department: 'Management / IT',
    photo_url: null,
    sort_order: 12,
    published: true,
  },
]
