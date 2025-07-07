const CafeDesign = () => {
  return (
    <div style={{
      fontFamily: '"Quicksand", "Comfortaa", sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff1f2 0%, #fef7ff 25%, #fdf4ff 50%, #fef3c7 75%, #fef9c3 100%)',
      color: '#831843'
    }}>
      <header style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #be185d 50%, #f59e0b 100%)',
        color: 'white',
        padding: '18px 25px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 8px 32px rgba(236, 72, 153, 0.3), 0 4px 16px rgba(245, 158, 11, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '3px solid rgba(255, 255, 255, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>田</div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>田中 太郎</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>会員ID: M12345 | 東京都新宿区</div>
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '8px 16px',
          borderRadius: '25px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>💎</span>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>15,420 pt</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>☕</span>
          <span style={{ fontFamily: '"Quicksand"', fontSize: '26px', fontWeight: '700', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>🌸✨ biid StoreConnect ✨🌸</span>
        </div>
        
        <nav style={{ display: 'flex', gap: '20px' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '20px' }}>店舗検索</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '20px' }}>♡ お気に入り</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '20px' }}>📋 履歴</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '20px' }}>⚙️ 設定</a>
        </nav>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        <aside style={{
          width: '300px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '20px',
          boxShadow: '4px 0 15px rgba(141, 110, 99, 0.1)',
          position: 'sticky',
          top: '80px',
          height: 'calc(100vh - 80px)',
          overflowY: 'auto'
        }}>
          <h3 style={{ fontFamily: '"Dancing Script"', fontSize: '24px', marginBottom: '20px', color: '#6d4c41' }}>🔍 検索条件</h3>
          
          <button style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #a1887f 0%, #8d6e63 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            marginBottom: '20px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>📍 現在地を取得</button>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>検索範囲</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              {['500m', '1km', '3km', '5km'].map((range, i) => (
                <button key={i} style={{
                  padding: '8px 12px',
                  border: '2px solid #d7ccc8',
                  borderRadius: '20px',
                  background: i === 2 ? '#d7ccc8' : 'white',
                  cursor: 'pointer'
                }}>{range}</button>
              ))}
            </div>
            <div style={{ fontSize: '12px', color: '#6d4c41', background: '#f5f1eb', padding: '10px', borderRadius: '10px' }}>
              <div>現在地: 東京都新宿区西新宿1-1-1</div>
              <div>検索範囲: 半径3km以内</div>
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>カテゴリー</label>
            {[
              { icon: '🍽️', text: 'レストラン・飲食店' },
              { icon: '🛍️', text: '小売・ショッピング' },
              { icon: '💅', text: 'サービス・美容' },
              { icon: '🎭', text: 'エンターテイメント' },
              { icon: '🏥', text: '医療・健康' },
              { icon: '📚', text: '教育・学習' }
            ].map((cat, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                <input type="checkbox" />
                <span>{cat.icon}</span>
                <span>{cat.text}</span>
              </label>
            ))}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>評価</label>
            <select style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '2px solid #d7ccc8', marginBottom: '10px' }}>
              <option>指定なし</option>
              <option>4.5以上</option>
              <option>4.0以上</option>
              <option>3.5以上</option>
              <option>3.0以上</option>
            </select>
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>営業状況</label>
            <select style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '2px solid #d7ccc8', marginBottom: '10px' }}>
              <option>指定なし</option>
              <option>営業中のみ</option>
              <option>24時間営業</option>
            </select>
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>価格帯</label>
            <select style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '2px solid #d7ccc8' }}>
              <option>指定なし</option>
              <option>リーズナブル (￥)</option>
              <option>普通 (￥￥)</option>
              <option>高級 (￥￥￥)</option>
              <option>最高級 (￥￥￥￥)</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>アクセシビリティ</label>
            {['車椅子対応', '駐車場あり', 'Wi-Fi完備'].map((item, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                <input type="checkbox" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </aside>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <section style={{ padding: '20px', background: 'white', margin: '20px', borderRadius: '20px', boxShadow: '0 8px 25px rgba(141, 110, 99, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ fontFamily: '"Dancing Script"', fontSize: '28px', color: '#6d4c41' }}>☕ 近くのbiid加盟店</h2>
              <span style={{ background: '#d7ccc8', padding: '5px 15px', borderRadius: '15px', fontWeight: 'bold' }}>12件</span>
            </div>
            <div style={{
              width: '100%',
              height: '400px',
              background: 'linear-gradient(135deg, #fff3f8 0%, #d8f1ff 100%)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: '#6d4c41',
              border: '2px solid #d7ccc8'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div>🗺️ Google Maps</div>
                <div style={{ fontSize: '14px', marginTop: '10px' }}>カスタムスタイリング適用済み</div>
              </div>
            </div>
          </section>

          <section style={{ padding: '20px', background: 'white', margin: '0 20px 20px', borderRadius: '20px', boxShadow: '0 8px 25px rgba(141, 110, 99, 0.1)' }}>
            <h2 style={{ fontFamily: '"Dancing Script"', fontSize: '28px', color: '#6d4c41', marginBottom: '20px' }}>☕ 店舗一覧</h2>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              {[
                { icon: '🍽️', name: 'カフェ・ドルチェ', category: 'レストラン・飲食店 ￥￥', rating: '4.6 (324件)', distance: '0.8km', status: '営業中', address: '東京都新宿区西新宿1-2-3', points: '150pt (還元率: 5%)' },
                { icon: '🛍️', name: 'ファッション館NOVA', category: '小売・ショッピング ￥￥', rating: '4.3 (156件)', distance: '1.2km', status: '営業中', address: '東京都新宿区西新宿2-4-5', points: '320pt (還元率: 3%)' },
                { icon: '💅', name: 'ビューティーサロン麗', category: 'サービス・美容 ￥￥￥', rating: '4.8 (89件)', distance: '0.6km', status: '営業中', address: '東京都新宿区西新宿1-6-7', points: '480pt (還元率: 8%)' }
              ].map((store, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #d7ccc8 0%, #bcaaa4 100%)',
                  borderRadius: '15px',
                  boxShadow: '0 4px 15px rgba(141, 110, 99, 0.2)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}>
                  <div style={{ fontSize: '40px' }}>{store.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: '"Dancing Script"', fontSize: '20px', margin: '0 0 5px 0', color: '#5d4037' }}>{store.name}</h3>
                    <div style={{ fontSize: '14px', color: '#6d4c41', marginBottom: '5px' }}>{store.category}</div>
                    <div style={{ background: '#8d6e63', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', display: 'inline-block', marginBottom: '8px' }}>biid加盟店</div>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '12px', marginBottom: '5px' }}>
                      <span>⭐ {store.rating}</span>
                      <span>📍 {store.distance}</span>
                      <span style={{ color: '#4caf50' }}>🟢 {store.status}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6d4c41', marginBottom: '5px' }}>{store.address}</div>
                    <div style={{ fontSize: '12px', color: '#8d6e63', fontWeight: 'bold' }}>💰 獲得ポイント: {store.points}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>詳細を見る</button>
                    <button style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#8d6e63',
                      border: '2px solid #8d6e63',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>地図で確認</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CafeDesign;
} else if (typeof window !== 'undefined') {
  window.CafeDesign = CafeDesign;
}
