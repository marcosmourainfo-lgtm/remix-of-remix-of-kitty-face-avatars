
# 🐱 Plataforma de Avatares de Gatinhos

Uma plataforma SaaS onde usuários criam avatares fofos de gatinhos usando inteligência artificial.

---

## 📱 Páginas e Funcionalidades

### 1. Landing Page
- Hero atrativo mostrando exemplos de avatares gerados
- Explicação de como funciona (3 passos simples)
- Comparativo dos planos Free x Premium
- Botão de "Começar Grátis"

### 2. Página de Criação de Avatar
- **Seletor de opções**: acessórios (chapéus, óculos, gravatas), roupas, cenários
- **Campo de texto livre** para descrições personalizadas (ex: "gatinho surfando no Havaí")
- Botão "Gerar Avatar" que usa IA para criar a imagem
- Preview do avatar gerado
- Contador de avatares restantes (para usuários free)

### 3. Meus Avatares
- Galeria com todos os avatares criados pelo usuário
- Opção de download (com marca d'água para free, sem para premium)
- Botões de compartilhamento para Instagram, WhatsApp, Twitter
- Opção de deletar avatares

### 4. Página de Preços/Assinatura
- Plano Free: 3 avatares com marca d'água
- Plano Premium: R$9,80/mês - avatares ilimitados sem marca d'água
- Integração com Stripe para pagamento recorrente

### 5. Autenticação
- Cadastro e login com email/senha
- Recuperação de senha
- Perfil do usuário com gestão da assinatura

---

## 🎨 Experiência do Usuário

- **Visual fofo e colorido** inspirado no estilo dos gatinhos das imagens
- Design responsivo (funciona em celular e desktop)
- Processo de criação simples e divertido
- Feedback visual durante a geração do avatar

---

## ⚙️ Backend Necessário

- **Autenticação**: login, cadastro, gestão de sessão
- **Banco de dados**: armazenar usuários, avatares criados, status da assinatura
- **Geração por IA**: integração com modelo de IA para criar os avatares
- **Armazenamento**: salvar as imagens geradas
- **Pagamentos**: integração com Stripe para assinatura mensal

