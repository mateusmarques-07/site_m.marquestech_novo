# M.marquestech — Site institucional

Site estático (HTML/CSS/JS puro, sem build). Basta abrir `index.html` no navegador ou subir a pasta inteira em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages, cPanel).

## Estrutura
- `index.html` — página principal (hero, planos, incluso, depoimentos, FAQ)
- `privacidade.html`, `termos.html` — páginas legais (LGPD e assinatura)
- `css/style.css`, `js/main.js`
- `assets/` — logos (variante para fundo escuro, fundo claro, e favicon), imagens 3D geradas (`render-*.png`, fundo transparente), ícones individuais recortados de duas colmeias geradas (`icon-*.png`, fundo transparente), a foto original de e-commerce (`scene-ecommerce.jpg`, não usada mais no site) e o render 3D atual da seção Sites — monitor + carrinho, fundo de estúdio limpo, recorte sem fundo feito com rembg/IA (`scene-cart-cutout.png`)

## Pendências que precisam de decisão sua antes de publicar de verdade

1. **Cláusula de cancelamento/fidelidade** (FAQ e `termos.html`): está com um texto genérico de "cobrança proporcional". Isso precisa passar por um advogado antes de virar contrato real com clientes.
2. ~~Domínio~~ — **resolvido (28/08):** modelo híbrido implementado no FAQ e no `termos.html` (cláusula 5) — o cliente escolhe entre domínio incluso (registrado por nós, sem custo extra enquanto a assinatura estiver ativa) ou domínio próprio. Falta só definir com apoio jurídico o que acontece com o domínio incluso em caso de cancelamento (transferência, taxa, prazo) — está sinalizado como placeholder no `termos.html`.
3. **Gateway de pagamento real (Pix + cartão)**: os botões de "assinar plano" hoje abrem o WhatsApp com mensagem pronta. Combinado que o checkout automático via API será implementado — falta você escolher o provedor (Mercado Pago, Pagar.me ou Stripe) e me passar as credenciais. Ainda não implementado.
4. **Imagem de compartilhamento (Open Graph)**: o `index.html` referencia `assets/og-image.png` (1200x630px) para a prévia do link quando compartilhado no WhatsApp — esse arquivo ainda não existe, porque eu só consigo gerar SVG, não PNG. Recomendo exportar uma versão em PNG da logo/banner (ex: via Figma, Canva, ou qualquer conversor online) e salvar nesse caminho.
5. ~~Domínio real do site~~ — **resolvido (28/08):** meta tags OG agora apontam para `https://mmarquestech.vercel.app/` (domínio da própria Vercel). Troque de novo se registrar um domínio próprio depois.
6. **Depoimentos**: são fictícios e estão marcados no código com o comentário `<!-- DEPOIMENTOS FICTÍCIOS — TROCAR POR REAIS -->`. Trocar assim que houver clientes reais dispostos a dar depoimento.
7. **Analytics/Pixel**: não incluí Google Analytics/Meta Pixel — avise se for rodar tráfego pago que eu adiciono.

## Revisão 7 (28/08/2026) — imagem do carrinho trocada por um render de estúdio (fundo limpo de verdade)

O recorte da foto da Revisão 6 ainda ficava com uma névoa sutil na borda (limitação da ferramenta de recorte automático numa foto com fundo complexo). Mateus gerou uma imagem nova pedindo explicitamente "fundo sólido, sem esfumaçado, iluminação de estúdio" — um monitor com loja em dark mode + carrinho de compras saindo da tela, cheio de caixas, fundo de estúdio cinza-claro liso.

- Fundo de estúdio liso = recorte com `rembg`/u2net saiu perfeito (sem buracos, sem halo) na primeira tentativa — confirma que pedir a imagem já com fundo limpo é melhor caminho do que tentar consertar um recorte difícil depois.
- Troquei `scene-ecommerce-cutout.png` por `scene-cart-cutout.png` em `#sites` e removi a máscara radial que eu tinha adicionado como "rede de segurança" pro halo anterior — não é mais necessária.

## Revisão 6 (28/08/2026) — seção Sites volta a ser texto + imagem lado a lado

Mateus não gostou do tratamento "foto saindo do canto com sombra" da Revisão 5 na seção Sites & E-commerce. Pediu pra tirar o fundo da foto e colocar ela ao lado do texto, num espaço próprio.

- Removi o fundo da foto de verdade (não só um degradê por cima) usando **rembg** (modelo u2net, rodando numa cópia reduzida da imagem pra não estourar a memória do VPS — a versão em resolução total travava o processo). Resultado em `assets/scene-ecommerce-cutout.png`.
- A seção `#sites` voltou a ser uma grade de duas colunas (`.sites-grid`: texto | imagem), com a foto recortada centralizada na coluna direita, brilho suave atrás e uma máscara radial bem aberta só pra suavizar a borda restante do recorte — sem o efeito de "sangrar pelo canto" que não tinha agradado.
- Removido o código agora morto do tratamento anterior (`.corner-device`, `.photo-frame`, `.reveal-drift`).

## Revisão 5 (28/08/2026) — imagens 3D reais no lugar dos mockups em CSS

Mateus gerou imagens (via Gemini) seguindo prompts que eu escrevi (render 3D estilo "glass", fundo preto, cores da marca). Processei tudo com Pillow: as 4 imagens principais viraram PNG com transparência de verdade (removi o fundo preto calculando alpha a partir do brilho de cada pixel), e as duas "colmeias" com vários ícones juntos foram recortadas em 19 arquivos individuais — tudo em `assets/`.

- **Hero**: os 4 estados que alternam a cada 3,5s agora são as imagens reais (notebook = Site, sacola + check = E-commerce, esfera com balões de chat = IA, blocos conectados = Automação), com um glow radial atrás de cada uma. O painel desenhado em CSS (`hero-panel`) foi removido.
- **Automação**: os blocos conectados aparecem parcialmente atrás do celular (mesma ideia de elemento cortado pela composição, sem competir com o chat).
- **Sites & E-commerce**: passou por duas versões nesta revisão. Primeiro usei a imagem da sacola como elemento flutuante saindo do canto; Mateus achou fraco e mandou mais duas fotos (mockup fotográfico de notebook + carrinho + caixas). Recortei a que tinha o fundo mais alinhado com a paleta do site (tons de azul/verde-água) removendo a pessoa que aparecia desfocada ao fundo (`scene-ecommerce.jpg`), e apliquei duas camadas de degradê: uma escurece a própria foto a partir do canto (`.photo-shade`), outra (`mask-image`) faz a foto inteira sumir suavemente antes de chegar no texto.
- Continuo sem acesso a geração de imagem ou banco de fotos neste ambiente — todo esse processamento (transparência, recorte, degradês) foi feito programaticamente em cima do que o Mateus gerou e enviou.
- **Sobra na pasta**: 16 imagens/ícones (agenda, hospedagem, pagamento, SEO, multi-dispositivo, avaliação, suporte, velocidade, painel admin, atendimento 24h, crescimento, integrações, notificação, rede, botão avançar) não foram usados ainda — ficam disponíveis pra próximas seções se fizer sentido.

## Revisão 4 (28/08/2026) — direção de arte: menos "template SaaS", mais produto digital

Duas rodadas de refinamento sobre a Revisão 3, pedidas depois de ver o resultado no ar.

**Rodada 1 — tirar a cara de mockup genérico:**
- Removida a janela de navegador com blocos de conteúdo falsos (hero) e o carrossel de 3 telas falsas (seção Sites) — ficavam ruins especialmente sobre fundo claro.
- Nova seção **"Jornada"** (`#jornada`, entre Sites e Automação): stepper de 5 passos ("Do primeiro clique ao cliente atendido"), a seção mais minimalista do site de propósito.
- Seção "Sites & E-commerce" virou fundo claro (`--paper`), texto em largura total, com um acento abstrato de gradiente + linhas/pontos no canto (sem imagem real).
- Seção "Incluso" também virou fundo claro, com os cards de vidro escuro trocados por blocos brancos simples.
- Planos ganharam uma tag de pilar por card (💻 SITE / 🛒 E-COMMERCE / 🤖 IA & AUTOMAÇÃO) e os valores foram atualizados: **R$109 / R$199 / R$349** (antes 119/299/449, incluindo nos links de WhatsApp).

**Rodada 2 — mais sofisticação, menos "AI generic":**
- Hero: painel de vidro 3D (perspectiva/rotação em CSS puro, sem lib 3D) com brilho de gradiente e uma linha de destaque, representando "um produto digital" de forma abstrata — celular do WhatsApp flutuando na frente. Flutuação lenta (12s) numa camada própria (`.float-layer`) pra nunca conflitar com o parallax do mouse que já existia.
- Sites & E-commerce: o acento do canto virou um fragmento 3D de tela (`.corner-device`) parcialmente cortado pela quina da seção, com um chip de carrinho, esmaecendo em gradiente (`mask-image`) até o espaço limpo do texto. Entra suavemente quando a seção aparece na rolagem (`.reveal-drift`, reusa o mesmo `IntersectionObserver` do resto do site) em vez de animar sozinho o tempo todo.
- Jornada: números viraram ícones (🔍💻💬🤖✅), e a linha entre as etapas muda de cor conforme passa de Sites (ciano) → contato (azul) → IA (violeta) — reforça visualmente que é a mesma jornada atravessando pilares diferentes. Pulso bem sutil e sequencial nos círculos.
- Planos: cada card ganhou um ícone gigante e quase invisível (opacity 0.1) sangrando no canto inferior, só como textura — usa `isolation: isolate` + `z-index: -1` pra ficar atrás do conteúdo sem vazar pros cards vizinhos.
- Automação, Incluso, FAQ e depoimentos ficaram como estavam nessa rodada — mantidos limpos de propósito, sem adicionar elemento só por adicionar.
- Testado com Playwright (desktop 1440px e mobile 390px) e checado console sem erros antes de cada commit. Nos celulares, os elementos 3D de canto (Hero e Sites) ficam ocultos — o layout foca em texto e nos elementos com conteúdo real.

## Revisão 3 (28/08/2026) — evolução visual completa

Reformulação de design pedida para dar peso igual aos dois pilares do negócio (Automação/IA e Sites/E-commerce) e elevar o nível visual pra "startup SaaS premium". Referências de estilo: veltrixsolutions.com.br e brainsistemas.com.br.

- **Hero:** headline reescrita ("Sites que vendem. Atendimento que nunca para."), com chips clicáveis dos dois pilares (🤖 Automação & IA / 💻 Sites & E-commerce) logo abaixo do texto — fica visível sem rolar a página. Badge de carrinho flutuante no mockup do navegador reforça e-commerce.
- **Nova seção "Automação & IA"** (`#automacao`): espelha a seção de sites, mas com paleta violeta/azul, mockup de chat do WhatsApp maior e "flow nodes" (ícones flutuantes de agenda/notificação/chat conectados por linhas tracejadas) representando o fluxo de automação.
- **Seção "Sites & E-commerce"** (`#sites`, antiga "Criação de Sites") ganhou mais peso: chips de destaque (100% responsivo, SEO otimizado, checkout seguro, sem taxa de adesão) e lista expandida (sites institucionais, landing pages, e-commerce, responsivo, integrações, otimização para conversão).
- **Ritmo entre seções:** alternância de tom (`--navy` / `--navy-alt`), blobs de gradiente desfocados (`.bg-blob`) e cores por pilar (cyan/azul = sites, violeta/azul = IA) pra criar hierarquia visual sem poluir.
- **Seção "Incluso" ganhou uma barra de números** (R$0 taxa de adesão, 100% hospedagem/SSL/suporte, Mensal) antes da grade de ícones — variação de formato pedida (números/dados).
- **Nav e footer** reorganizados: "Sites" e "Automação" entraram no menu principal, substituindo "Diferenciais"/"Depoimentos" (que continuam só no footer).
- **Bug corrigido:** os anéis orbitais decorativos (`.orbit-ring`, `.cv-ring`, novo `.av-ring`) usavam `border-image` com `border-radius`, combinação que não funciona na maioria dos navegadores e renderizava como linhas diagonais em vez de círculo. Trocado pela técnica de `mask` com `content-box`.
- **FAQ do domínio reescrita** com comparação visual (`domínio incluso` vs `domínio próprio`) — ver pendência 2 resolvida acima. Mesma cláusula atualizada no `termos.html`.
- **Meta tags OG** atualizadas para `https://mmarquestech.vercel.app/` — ver pendência 5 resolvida acima.
- Testado com Playwright (desktop 1440px e mobile 390px, scroll completo pra disparar as animações de reveal) e checado console sem erros de JS antes do commit.
- **Não implementado nesta revisão:** checkout automático via API (Pix/cartão) — depende de você escolher o provedor de pagamento e passar credenciais (pendência 3 acima).

## Revisão 2 (26/08/2026)
- Hero dividido em duas colunas: texto + visual animado (janela de navegador + celular com chat do WhatsApp "digitando", anéis orbitando ao redor — tudo em CSS, sem imagens de banco de imagens, então não há problema de direito autoral).
- Nova seção "Criação de Sites" logo após o hero, dando mais destaque a esse serviço.
- Preço do plano Essencial: R$ 149,00 → **R$ 119,00**.
- Plano Especialista ganhou um selo flutuante de carrinho (🛒).
- Plano Inteligente agora mostra dois blocos bem separados — "Para clínicas" (com automação via n8n) e "Para restaurantes" (apenas site + cardápio, **sem automação por enquanto**) — para não dar a entender que o restaurante também recebe a secretária de IA.
- Depoimentos: removido o texto visível "Nome Fictício" de todos os cards, substituído por nomes fictícios mais realistas (ex: "Camila R.", "Clínica Vitalle"). Continuam marcados como fictícios só no comentário do código-fonte.
- Preços agora usam fonte monoespaçada (JetBrains Mono) para reforçar a estética "produto de tecnologia".
- Nota sobre as imagens de referência que você enviou (freepik/shutterstock/robô 3D): não foram usadas diretamente por terem marca d'água/direitos de banco de imagens. Optei por recriar o mesmo efeito ("visual 3D flutuante") todo em CSS, e evitei o robô literal porque o brief original pedia para não usar ícone de robô — se você preferir ter um robô 3D de verdade, me avise que ajusto.

## O que já foi resolvido desta revisão
- Bug de encoding no SVG (`Â·` → `·`)
- Wordmark do logo em branco para uso sobre fundo escuro (o arquivo original só funcionava em fundo claro)
- Ícone apenas do monograma (`favicon-monogram.svg`) para uso em favicon/ícone de app
- Botão flutuante do WhatsApp em todas as páginas, para +55 61 98299-8511
- CNPJ 55.022.155/0001-10 no rodapé
- Banner de cookies (LGPD) + páginas de Política de Privacidade e Termos
- FAQ com a pergunta de cancelamento antecipado (que estava faltando)
