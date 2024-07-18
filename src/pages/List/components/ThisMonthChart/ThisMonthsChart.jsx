import React, { useState, useEffect } from "react";
import "./ThisMonthsChart.css";
import IdolDetail from "../IdolDetail";
import ChartVoteModal from "../ChartVoteModal/ChartVoteModal";
import useIdolChart from "../../../../hooks/useIdolChart";

const getPageSize = () => {
  const width = window.innerWidth;
  if (width < 1200) {
    return 5;
  }
  return 10;
};

function ThisMonthsChart() {
  const [activeTab, setActiveTab] = useState("female");
  const [pageSize, setPageSize] = useState(getPageSize());
  const { idolRank, loading, fetchError, fetchData } = useIdolChart(
    activeTab,
    pageSize
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(pageSize);

  useEffect(() => {
    const handleResize = () => {
      const newPageSize = getPageSize();
      setPageSize(newPageSize);
      setDisplayCount(newPageSize);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openGenderVoteModal = () => {
    setIsModalOpen(true);
  };
  const updateIdolRank = () => {
    fetchData(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const tab = (gender) => {
    setActiveTab(gender);
    setDisplayCount(pageSize);
  };

  const loadMore = () => {
    setDisplayCount((prevCount) => prevCount + pageSize);
  };

  return (
    <div className="chart">
      <div className="chart-header">
        <h3>이달의 차트</h3>
        <button
          type="button"
          aria-label="차트 투표하기"
          className="btn-modal-open"
          onClick={openGenderVoteModal}
        >
          <i className="icon-chart" />
          차트 투표하기
        </button>
      </div>
      <div className="chart-tab">
        <button
          type="button"
          className={`chart-tab-button ${activeTab === "female" ? "active" : ""}`}
          onClick={() => tab("female")}
        >
          이달의 여자 아이돌
        </button>
        <button
          type="button"
          className={`chart-tab-button ${activeTab === "male" ? "active" : ""}`}
          onClick={() => tab("male")}
        >
          이달의 남자 아이돌
        </button>
      </div>

      {loading && (
        <div className="chart-wrap">
          <Loadingbar />
        </div>
      )}
      {fetchError && <div>Error loading data</div>}
      <ul className="ranking-list">
        {!loading &&
          !fetchError &&
          idolRank
            .slice(0, displayCount)
            .map((idol) => <IdolDetail key={idol.id} idolData={idol} />)}
      </ul>
      {displayCount < idolRank.length && (
        <button
          className="btn-more"
          type="button"
          aria-label="더보기 버튼"
          onClick={loadMore}
        >
          더 보기
        </button>
      )}
      {isModalOpen && (
        <ChartVoteModal
          closeModal={closeModal}
          idolRank={idolRank}
          gender={activeTab}
          updateIdolRank={updateIdolRank}
        />
      )}
    </div>
  );
}

export default ThisMonthsChart;
