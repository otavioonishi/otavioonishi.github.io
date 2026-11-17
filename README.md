# Otávio Onishi — portfólio

Site pessoal de Otávio Onishi, desenvolvedor de sistemas. HTML, CSS e JavaScript puros,
sem build, sem dependências instaladas e sem framework: basta abrir `index.html` no navegador.

## Estrutura

```
otavio proj/
├── index.html              página principal
├── 404.html                página de erro (independente, CSS próprio)
├── privacidade.html        política de privacidade (LGPD)
├── robots.txt              instruções para buscadores
├── sitemap.xml             mapa do site
├── README.md               este arquivo
└── assets/
    ├── css/
    │   ├── base.css        tokens, reset, tipografia, botões
    │   ├── sections.css    header, hero, seções e rodapé
    │   ├── ui.css          toasts, voltar ao topo, animações
    │   └── responsive.css  media queries (carregar por último)
    ├── js/
    │   ├── config.js       contatos e links  ← edite aqui
    │   ├── icons.js        ícones SVG (Lucide)
    │   └── main.js         interações da página
    └── img/
        ├── favicon.svg
        ├── apple-touch-icon.png
        ├── og-cover.jpg    imagem de compartilhamento (1200×630)
        └── projetos/
            └── ana-nails.jpg
```

A ordem de carregamento importa: `config.js` → `icons.js` → `main.js` e
`base.css` → `sections.css` → `ui.css` → `responsive.css`.

## Personalizar

### Contatos e links

Tudo o que é variável está em **`assets/js/config.js`**:

| Campo | O que é |
| --- | --- |
| `whatsapp` | DDI + DDD + número, só dígitos (ex.: `5511987654321`) |
| `emailUserB64` / `emailDomainB64` | e-mail em base64, separado em usuário e domínio |
| `github`, `instagram`, `anaNailsLink` | URLs completas, sempre `https://` |
| `formEndpoint` | opcional; endpoint que receba `POST` JSON. Se vazio, o formulário usa WhatsApp/e-mail |

O e-mail fica em base64 apenas para dificultar a coleta por robôs de spam.
Para trocar, gere o base64 do usuário e do domínio em <https://www.base64encode.org/>.

### Textos e conteúdo

O conteúdo (seções, projetos, serviços) está em `index.html`. A aparência está nos
arquivos de `assets/css/`; as cores principais são variáveis CSS no topo de `base.css`:

```css
--bg: #090D12;
--accent: #A3FF5F;
--text: #E8EEF5;
```

## Publicar

Publicado em **https://otavioonishi.github.io/** via GitHub Pages, a partir da branch
`main` do repositório `otavioonishi/otavioonishi.github.io` (raiz do domínio).

O site funciona em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel,
Cloudflare Pages, hospedagem comum). Não há passo de build: envie a pasta inteira.

Os metadados de URL já apontam para o domínio real em `index.html` (canonical,
Open Graph, Twitter e JSON-LD), `privacidade.html`, `robots.txt` e `sitemap.xml`.
Se trocar de domínio, atualize `SEU-DOMINIO`/a URL nesses mesmos arquivos.

Valide o resultado com o [Rich Results Test](https://search.google.com/test/rich-results)
e envie o `sitemap.xml` no Google Search Console.

Se publicar em um subdiretório (ex.: `usuario.github.io/portfolio/`), ajuste também
todos os caminhos relativos `assets/...` — ou publique na raiz do domínio.

## Formulário

O formulário fica recolhido em um `<details id="form-gate">`: o visitante precisa clicar
em **Preencher solicitação** (ou em qualquer CTA “Solicitar orçamento”) para abri-lo.
Os CTAs dos serviços já pré-selecionam o tipo de serviço e levam o foco ao primeiro campo.
Campos fechados não ficam expostos nem acessíveis por Tab.

Sem `formEndpoint` configurado, o envio abre o WhatsApp com a mensagem já montada
(ou o aplicativo de e-mail, se o WhatsApp não estiver configurado). Nenhum dado é
armazenado no site. Se o navegador bloquear a nova aba, a solicitação é aberta na
própria aba.

Para receber por e-mail sem depender do WhatsApp, crie uma conta em um serviço como
Formspree/Web3Forms e cole a URL em `formEndpoint`.

## Acessibilidade e SEO já aplicados

- HTML semântico, um único `<h1>` e hierarquia de títulos coerente;
- link “pular para o conteúdo”, foco visível e menu móvel com `inert`;
- contraste mínimo de 4,5:1 no texto secundário;
- formulário com `label`, `aria-describedby` e mensagens de erro associadas;
- `prefers-reduced-motion` respeitado;
- Open Graph, Twitter Card, JSON-LD (`Person` + `ProfessionalService`), canonical e sitemap;
- `404.html` com `noindex`.

## Compatibilidade

Navegadores modernos (Chrome, Edge, Firefox, Safari). O JavaScript é ES5 e não usa
módulos, portanto o site também funciona aberto diretamente via `file://`.
