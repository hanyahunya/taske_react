import React from 'react';

// 화면 전체를 덮는 반투명 오버레이 스타일
const loadingOverlayStyle = {
  position: 'fixed', // 화면에 고정
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.8)', // 흰색 반투명 배경
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999, // 다른 모든 요소들 위에 표시되도록 z-index를 매우 높게 설정
  backdropFilter: 'blur(4px)', // 뒷 배경을 흐리게 하여 비활성화된 느낌을 강조 (선택 사항)
  WebkitBackdropFilter: 'blur(4px)', // Safari 브라우저 호환성
};

// 기존에 사용하시던 회전 프레임 스타일
const frameStyle = {
  width: '30px',
  height: '30px',
  border: '3px solid #000',
  animation: 'spin-frame 1.8s cubic-bezier(0.65, 0.05, 0.36, 1) infinite',
};

const keyframesStyle = `
  @keyframes spin-frame {
    0% { 
      transform: rotate(45deg) scale(1); 
      border-width: 3px;
    }
    50% { 
      transform: rotate(225deg) scale(0.8); 
      border-width: 5px;
    }
    100% { 
      transform: rotate(405deg) scale(1); 
      border-width: 3px;
    }
  }
`;

const Loading = () => {
  return (
    <>
      <style>{keyframesStyle}</style>
      {/* 최상위 div의 스타일을 loadingOverlayStyle로 변경 */}
      <div style={loadingOverlayStyle}>
        <div style={frameStyle}></div>
      </div>
    </>
  );
};

export default Loading;