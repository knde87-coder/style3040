(function () {
  const USERS_KEY = "goodform.users";
  const CURRENT_USER_KEY = "goodform.currentUser";

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getUsers() {
    return readJson(USERS_KEY, []);
  }

  function saveUsers(users) {
    writeJson(USERS_KEY, users);
  }

  function getCurrentUser() {
    return readJson(CURRENT_USER_KEY, null);
  }

  function setCurrentUser(user) {
    writeJson(CURRENT_USER_KEY, user);
  }

  function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  function safeText(value) {
    return String(value || "").trim();
  }

  async function createUser({ id, password = "", name = "", provider = "idpw" }) {
    const fb = await window.goodformFirebase?.ready;
    if (fb?.enabled && provider === "idpw") {
      const firebaseUser = await fb.createUser({ id, password, name });
      setCurrentUser(firebaseUser);
      return firebaseUser;
    }

    const userId = safeText(id);
    if (!userId) throw new Error("아이디를 입력해 주세요.");
    const users = getUsers();
    if (users.some((user) => user.id === userId)) throw new Error("이미 가입된 아이디입니다.");
    const user = {
      id: userId,
      password,
      name: safeText(name) || userId,
      provider,
      role: "customer",
      joinedAt: new Date().toISOString()
    };
    users.unshift(user);
    saveUsers(users);
    setCurrentUser({ id: user.id, name: user.name, provider: user.provider, role: user.role });
    return user;
  }

  async function loginUser(id, password) {
    const fb = await window.goodformFirebase?.ready;
    if (fb?.enabled) {
      const firebaseUser = await fb.loginUser(id, password);
      setCurrentUser(firebaseUser);
      return firebaseUser;
    }

    const userId = safeText(id);
    const users = getUsers();
    const user = users.find((item) => item.id === userId && item.password === password);
    if (!user) throw new Error("아이디 또는 비밀번호를 확인해 주세요.");
    setCurrentUser({ id: user.id, name: user.name, provider: user.provider, role: user.role });
    return user;
  }

  async function startKakao() {
    const fb = await window.goodformFirebase?.ready;
    if (fb?.enabled) {
      const firebaseUser = await fb.loginWithKakao();
      setCurrentUser(firebaseUser);
      return firebaseUser;
    }

    const kakaoId = "kakao-goodform-user";
    const users = getUsers();
    let user = users.find((item) => item.id === kakaoId);
    if (!user) {
      user = {
        id: kakaoId,
        password: "",
        name: "카카오 회원",
        provider: "kakao",
        role: "customer",
        joinedAt: new Date().toISOString()
      };
      users.unshift(user);
      saveUsers(users);
    }
    setCurrentUser({ id: user.id, name: user.name, provider: user.provider, role: user.role });
    return user;
  }

  async function logout() {
    const fb = await window.goodformFirebase?.ready;
    if (fb?.enabled) await fb.logout();
    clearCurrentUser();
  }

  function setMessage(text, isError = false) {
    const message = document.getElementById("auth-message");
    if (!message) return;
    message.textContent = text;
    message.classList.toggle("error", isError);
  }

  function refreshUtilityBar() {
    const user = getCurrentUser();
    document.querySelectorAll(".shop-utility-bar, .oz-member-links").forEach((bar) => {
      const loginLink = bar.querySelector('a[href="/login"]');
      const signupLink = bar.querySelector('a[href="/signup"]');
      if (!user) return;
      if (loginLink) {
        loginLink.href = "/mypage";
        loginLink.textContent = `${user.name || user.id}님`;
      }
      if (signupLink) {
        signupLink.href = "#logout";
        signupLink.textContent = "로그아웃";
        signupLink.addEventListener("click", async (event) => {
          event.preventDefault();
          await logout();
          window.location.href = "/";
        }, { once: true });
      }
    });
  }

  function bindLogin() {
    const form = document.getElementById("login-form");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        await loginUser(document.getElementById("login-id").value, document.getElementById("login-password").value);
        window.location.href = "/mypage";
      } catch (error) {
        setMessage(error.message || "로그인에 실패했습니다.", true);
      }
    });
  }

  function bindSignup() {
    const form = document.getElementById("signup-form");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const password = document.getElementById("signup-password").value;
      const confirm = document.getElementById("signup-password-confirm").value;
      if (password.length < 4) {
        setMessage("비밀번호는 4자 이상으로 입력해 주세요.", true);
        return;
      }
      if (password !== confirm) {
        setMessage("비밀번호 확인이 일치하지 않습니다.", true);
        return;
      }
      try {
        await createUser({
          id: document.getElementById("signup-id").value,
          password,
          name: document.getElementById("signup-name").value,
          provider: "idpw"
        });
        window.location.href = "/mypage";
      } catch (error) {
        setMessage(error.message || "회원가입에 실패했습니다.", true);
      }
    });
  }

  function bindKakaoButtons() {
    document.querySelectorAll("[data-kakao-auth]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        try {
          await startKakao();
          window.location.href = "/mypage";
        } catch (error) {
          setMessage(error.message || "카카오 로그인 연결을 확인해 주세요.", true);
        }
      });
    });
  }

  function bindMyPage() {
    const page = document.getElementById("mypage-card");
    if (!page) return;
    const user = getCurrentUser();
    if (!user) {
      page.innerHTML = `<h1>내정보</h1><p class="signup-guide">로그인 후 주문내역, 배송정보, 회원정보를 확인할 수 있습니다.</p><a class="login-main-button" href="/login">로그인하기</a>`;
      return;
    }
    document.getElementById("mypage-name").textContent = user.name || user.id;
    document.getElementById("mypage-id").textContent = user.id;
    document.getElementById("mypage-provider").textContent = user.provider === "kakao" ? "카카오톡 가입" : "ID/PW 가입";
    document.getElementById("logout-button").addEventListener("click", async () => {
      await logout();
      window.location.href = "/";
    });
  }

  window.GoodformAuth = {
    getUsers,
    getCurrentUser,
    clearCurrentUser,
    createUser,
    loginUser,
    startKakao,
    logout
  };

  document.addEventListener("DOMContentLoaded", () => {
    refreshUtilityBar();
    bindLogin();
    bindSignup();
    bindKakaoButtons();
    bindMyPage();
  });
})();
