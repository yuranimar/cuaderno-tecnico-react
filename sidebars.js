const sidebars = {
  cuadernoSidebar: [

    {
      type: 'doc',
      id: 'intro',
      label: '🏠 Inicio',
    },

    {
      type: 'category',
      label: '⚙️ Desarrollo Backend',
      collapsible: true,
      collapsed: false,
      link: { type: 'generated-index', title: 'Desarrollo Backend', slug: '/backend' },
      items: ['backend/nestjs', 'backend/django', 'backend/apis', 'backend/bases-datos', 'backend/typescript'],
    },

    {
      type: 'category',
      label: '🎨 Desarrollo Frontend',
      collapsible: true,
      collapsed: true,
      link: { type: 'generated-index', title: 'Desarrollo Frontend', slug: '/frontend' },
      items: ['frontend/desarrollo-web', 'frontend/react', 'frontend/gsap', 'frontend/diseno-ux', 'frontend/frameworks'],
    },

    {
      type: 'category',
      label: '🛠️ DevOps & Herramientas',
      collapsible: true,
      collapsed: true,
      link: { type: 'generated-index', title: 'DevOps & Herramientas', slug: '/devops' },
      items: ['devops/git', 'devops/aws', 'devops/lenguajes-programacion', 'devops/tecnologias'],
    },

    {
      type: 'category',
      label: '🏗️ Arquitectura & Patrones',
      collapsible: true,
      collapsed: true,
      link: { type: 'generated-index', title: 'Arquitectura & Patrones', slug: '/arquitectura' },
      items: ['arquitectura/mvc', 'arquitectura/desarrollo-software'],
    },

    {
      type: 'category',
      label: '📋 Metodologías',
      collapsible: true,
      collapsed: true,
      link: { type: 'doc', id: 'metodologias/agiles' },
      items: ['metodologias/agiles'],
    },

    {
      type: 'category',
      label: '📦 Logística',
      collapsible: true,
      collapsed: true,
      link: { type: 'doc', id: 'logistica/logistica' },
      items: ['logistica/logistica'],
    },

    {
      type: 'category',
      label: '🤖 Inteligencia Artificial',
      collapsible: true,
      collapsed: true,
      link: { type: 'doc', id: 'ia/ia' },
      items: ['ia/ia'],
    },

  ],
};

export default sidebars;