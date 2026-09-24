/* UEI Lab — bilingual research themes. */
window.UEI = window.UEI || {};
UEI.research = {
  "intro": {
    "ko": "위성영상과 지구지능 기술을 연결하여 도시의 변화와 기후위험을 이해하고, 지속가능하고 회복탄력성 있는 도시를 위한 해법을 탐구합니다.",
    "en": "We connect satellite imagery with Earth intelligence to understand urban change and climate risk, and explore solutions for sustainable and resilient cities."
  },
  "areas": [
    {
      "id": "urban-morphology",
      "title": {
        "ko": "도시 형태와 성장",
        "en": "Urban form & growth"
      },
      "summary": {
        "ko": "국지기후대 지도와 도시 성장궤도로 도시 형태의 변화와 환경 영향을 분석합니다.",
        "en": "Mapping Local Climate Zones and urban growth trajectories to understand changes in urban form and their environmental impacts."
      },
      "body": {
        "ko": "<p>위성영상, 건물 정보, 인공지능 기술을 활용해 도시와 자연 경관을 공통 기준으로 구분하는 국지기후대(Local Climate Zone, LCZ)를 지도화합니다. 과거부터 현재까지 도시 형태의 성장궤도를 추적하고, 이러한 변화가 도시 환경에 미치는 영향을 밝힙니다.</p><p>대표적으로 딥러닝을 활용한 LCZ 지도화와 도시 형태가 열환경에 미치는 영향에 관한 연구를 수행하고 있습니다.</p>",
        "en": "<p>We use satellite imagery, building information, and AI to map Local Climate Zones (LCZs), a common framework for classifying built and natural landscapes. By tracing urban growth trajectories from the past to the present, we investigate how changes in urban form affect the urban environment.</p><p>Representative studies develop deep learning methods for LCZ mapping and examine how urban form influences thermal conditions.</p>"
      },
      "keywords": [
        {
          "ko": "국지기후대",
          "en": "Local Climate Zones"
        },
        {
          "ko": "도시 성장궤도",
          "en": "Urban growth trajectories"
        },
        {
          "ko": "딥러닝",
          "en": "Deep learning"
        }
      ],
      "image": "assets/img/research/urban-form-growth.webp"
    },
    {
      "id": "urban-heat",
      "title": {
        "ko": "도시 열환경 평가",
        "en": "Urban thermal environment"
      },
      "summary": {
        "ko": "위성 지표면온도와 AI를 활용해 도시의 열환경을 모니터링하고 열위험을 평가합니다.",
        "en": "Monitoring urban thermal conditions and assessing heat risk using satellite land surface temperature and AI."
      },
      "body": {
        "ko": "<p>위성의 열적외선(Thermal Infrared, TIR) 관측에서 산출한 지표면온도 자료를 활용해 도시의 열환경을 모니터링합니다.</p><p>주요 연구에는 AI 기반 지표면온도 공간상세화, 지표면온도를 활용한 대기온도 추정, 위성 자료에 기반한 도시열섬 강도 평가가 있습니다. 여기에 인구 노출과 사회적 취약성을 결합하여 도시 내 열위험을 평가하는 프레임워크를 구축합니다.</p>",
        "en": "<p>We monitor the urban thermal environment using land surface temperature derived from satellite thermal infrared (TIR) observations.</p><p>Our work includes AI-based spatial downscaling of land surface temperature, air temperature estimation from surface temperature, and satellite-based assessment of urban heat island intensity. We combine these approaches with population exposure and social vulnerability to develop frameworks for assessing heat risk within cities.</p>"
      },
      "keywords": [
        {
          "ko": "열적외선 원격탐사",
          "en": "Thermal remote sensing"
        },
        {
          "ko": "지표면온도",
          "en": "Land surface temperature"
        },
        {
          "ko": "열위험 평가",
          "en": "Heat risk assessment"
        }
      ],
      "image": "assets/img/research/urban-thermal-environment.webp"
    },
    {
      "id": "industrial-land",
      "title": {
        "ko": "산업단지와 탄소 배출",
        "en": "Industrial land & carbon emissions"
      },
      "summary": {
        "ko": "전 세계 산업용지를 지도화하고 산업 확장, 경제 활동, 탄소 배출의 관계를 분석합니다.",
        "en": "Mapping industrial land worldwide and linking industrial expansion to economic activity and carbon emissions."
      },
      "body": {
        "ko": "<p>산업용지는 도시 경제를 뒷받침하지만, 환경에 미치는 영향은 발전 수준과 지역에 따라 다릅니다. 위성영상, 건물 정보, 야간조도, AI 기술을 결합해 전 세계 산업용지를 식별하고 경제 활동 및 탄소 배출과의 관계를 분석합니다.</p><p>전 세계 1,000개 이상 대도시의 산업용지를 10 m 해상도로 지도화한 자료를 구축했습니다. 또한 10개국을 대상으로 산업 확장이 경제 성장 및 CO₂ 배출과 맺는 관계를 분석했습니다.</p>",
        "en": "<p>Industrial land supports urban economies, but its environmental impacts vary across regions and levels of development. We combine satellite imagery, building information, nighttime lights, and AI to identify industrial land worldwide and analyze its relationships with economic activity and carbon emissions.</p><p>We have developed a dataset mapping industrial land at 10 m resolution across more than 1,000 large cities worldwide. We have also examined the links between industrial expansion, economic growth, and CO₂ emissions in ten countries.</p>"
      },
      "keywords": [
        {
          "ko": "산업용지 지도화",
          "en": "Industrial land mapping"
        },
        {
          "ko": "야간조도",
          "en": "Nighttime lights"
        },
        {
          "ko": "탄소 배출",
          "en": "Carbon emissions"
        }
      ],
      "image": "assets/img/research/industrial-land-carbon.webp"
    },
    {
      "id": "green-infrastructure",
      "title": {
        "ko": "도시 탄소중립 인프라",
        "en": "Urban carbon-neutral infrastructure"
      },
      "summary": {
        "ko": "도시 녹지와 수목의 냉각 효과를 정량화하고 탄소중립·기후적응을 위한 근거를 마련합니다.",
        "en": "Quantifying cooling benefits from urban vegetation to support carbon neutrality and climate adaptation."
      },
      "body": {
        "ko": "<p>도시숲, 공원, 생태축, 녹지 등 탄소 흡수원을 넓히는 인프라가 폭염과 도시열섬을 완화하는 효과를 정량화합니다. 위성영상으로 도시 탄소중립 인프라를 모니터링하고, AI 기반 분석과 인과추론을 결합해 도시 환경에 미치는 영향을 연구합니다.</p><p>진행 중인 연구에서는 도시 수목이 지표면온도 저감에 미치는 효과를 추정합니다. 미국 로스앤젤레스에서는 보행로와 버스 정류장 주변 녹지의 냉각 효과를 위성 지표면온도 자료로 분석했습니다.</p>",
        "en": "<p>We quantify how urban forests, parks, ecological corridors, and green spaces—carbon-sink infrastructure—mitigate extreme heat and urban heat islands. We monitor urban carbon-neutral infrastructure using satellite imagery and combine AI-based analysis with causal inference to investigate its environmental impacts.</p><p>Ongoing research estimates the effects of urban trees on land surface temperature. In Los Angeles, we have used satellite land surface temperature to analyze cooling from vegetation around pedestrian routes and bus stops.</p>"
      },
      "keywords": [
        {
          "ko": "도시 수목",
          "en": "Urban trees"
        },
        {
          "ko": "녹지 냉각 효과",
          "en": "Green-space cooling"
        },
        {
          "ko": "인과추론",
          "en": "Causal inference"
        }
      ],
      "image": "assets/img/research/carbon-neutral-infrastructure.webp"
    }
  ],
  "projects": []
};
