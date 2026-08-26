# M.marquestech — Site institucional

Site estático (HTML/CSS/JS puro, sem build). Basta abrir `index.html` no navegador ou subir a pasta inteira em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages, cPanel).

## Estrutura
- `index.html` — página principal (hero, planos, incluso, depoimentos, FAQ)
- `privacidade.html`, `termos.html` — páginas legais (LGPD e assinatura)
- `css/style.css`, `js/main.js`
- `assets/` — logos (variante para fundo escuro, fundo claro, e favicon)

## Pendências que precisam de decisão sua antes de publicar de verdade

1. **Cláusula de cancelamento/fidelidade** (FAQ e `termos.html`): está com um texto genérico de "cobrança proporcional". Isso precisa passar por um advogado antes de virar contrato real com clientes.
2. **Domínio**: assumi que o domínio NÃO está incluso na mensalidade (cliente registra o próprio). Se a regra for outra, é só avisar que eu ajusto o FAQ e o `termos.html`.
3. **Gateway de pagamento real**: os botões de "assinar plano" hoje abrem o WhatsApp com mensagem pronta. Não há checkout automático (Pix/cartão) — isso exigiria integrar um provedor (Mercado Pago, Pagar.me, Stripe) com credenciais reais seu.
4. **Imagem de compartilhamento (Open Graph)**: o `index.html` referencia `assets/og-image.png` (1200x630px) para a prévia do link quando compartilhado no WhatsApp — esse arquivo ainda não existe, porque eu só consigo gerar SVG, não PNG. Recomendo exportar uma versão em PNG da logo/banner (ex: via Figma, Canva, ou qualquer conversor online) e salvar nesse caminho.
5. **Domínio real do site**: troque `https://www.mmarquestech.com.br/` (usado nas meta tags OG) pelo domínio definitivo quando escolhido.
6. **Depoimentos**: são fictícios e estão marcados no código com o comentário `<!-- DEPOIMENTOS FICTÍCIOS — TROCAR POR REAIS -->`. Trocar assim que houver clientes reais dispostos a dar depoimento.
7. **Analytics/Pixel**: não incluí Google Analytics/Meta Pixel — avise se for rodar tráfego pago que eu adiciono.

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
