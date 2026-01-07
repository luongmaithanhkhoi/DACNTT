'use client'

import { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js'
import Head from 'next/head'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

ChartJS.register(ArcElement, Tooltip, Legend)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ProfilePage() {
  const [selectedSemester, setSelectedSemester] = useState('HK1')
  const [stats, setStats] = useState({
    totalStudents: 0,
    studentsPending: 0,
    studentsInProgress: 0,
    studentsCompleted: 0,
    jobPosts: 0,
    events: 0,
  })

  // Xác định học kỳ dựa trên tháng hiện tại
  const determineSemester = (month: number) => {
    if (month >= 1 && month <= 4) return 'HK2';  // Học kỳ 2 (Tháng 1 đến Tháng 4)
    if (month === 5 || month === 6) return 'HKHE';  // Học kỳ hè (Tháng 4 đến Tháng 6)
    return 'HK1';  // Học kỳ 1 (Còn lại)
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Vui lòng đăng nhập");
        window.location.href = "/login";
        return;
      }

      const currentMonth = new Date().getMonth() + 1;  // Tháng hiện tại (1 - 12)
      const semester = determineSemester(currentMonth); // Xác định học kỳ

      try {
        // Gọi API thống kê sinh viên theo học kỳ
        const studentStatsRes = await fetch(`/api/faculty/statistics/students?semester=${semester}`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        const studentStats = await studentStatsRes.json();
        if (studentStats.success) {
          setStats(prevStats => ({
            ...prevStats,
            totalStudents: studentStats.data.totalStudents,
            studentsPending: studentStats.data.studentsPending,
            studentsInProgress: studentStats.data.studentsInProgress,
            studentsCompleted: studentStats.data.studentsCompleted,
          }));
        } else {
          alert('Không thể lấy thống kê sinh viên');
        }

        // Gọi API thống kê bài đăng
        const jobStatsRes = await fetch(`/api/faculty/statistics/jobs-events?semester=${semester}`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        const jobStats = await jobStatsRes.json();
        if (jobStats.success) {
          setStats(prevStats => ({
            ...prevStats,
            jobPosts: jobStats.data.jobPosts,
            events: jobStats.data.events,
          }));
        } else {
          alert('Không thể lấy thống kê bài đăng');
        }
      } catch (error) {
        alert('Lỗi khi tải thống kê');
        console.error(error);
      }
    };

    fetchStatistics();
  }, [selectedSemester]); // Fetch lại khi học kỳ thay đổi

  // Dữ liệu cho biểu đồ sinh viên
  const studentChartData = {
    labels: [
      `Đang ứng tuyển (${stats.studentsPending})`,
      `Đang thực tập (${stats.studentsInProgress})`,
      `Hoàn thành thực tập (${stats.studentsCompleted})`,
    ],
    datasets: [
      {
        data: [
          stats.studentsPending,
          stats.studentsInProgress,
          stats.studentsCompleted,
        ],
        backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  }

  // Dữ liệu cho biểu đồ bài đăng
  const jobChartData = {
    labels: [
      `Bài đăng tuyển dụng (${stats.jobPosts})`,
      `Sự kiện (${stats.events})`,
    ],
    datasets: [
      {
        data: [stats.jobPosts, stats.events],
        backgroundColor: ['#FF6384', '#36A2EB'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  }

  // Custom options để hiển thị phần trăm trong chart
  const options: ChartOptions<'doughnut'> = {
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        position: 'top',
      },
    },
  }

  return (
    <div className="inner-content py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="bg-white rounded shadow p-5 mb-5 text-center">
              <h1 className="fs-1 fw-bold mb-3">Thống Kê Báo Cáo Thực Tập</h1>
              {/* Các thống kê nhỏ (card) */}
              <div className="row g-4 text-center mb-5">
                <div className="col-md-3">
                  <div className="card shadow-sm p-4 bg-light">
                    <h5>Tổng Sinh Viên</h5>
                    <h3 className="text-danger">{stats.totalStudents}</h3>
                    <p>Sinh viên tổng</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card shadow-sm p-4 bg-info text-white">
                    <h5>Đang Ứng Tuyển</h5>
                    <h3>{stats.studentsPending}</h3>
                    <p>Sinh viên chưa thực tập</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card shadow-sm p-4 bg-warning text-dark">
                    <h5>Đang Thực Tập</h5>
                    <h3>{stats.studentsInProgress}</h3>
                    <p>Sinh viên đang thực tập</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card shadow-sm p-4 bg-success text-white">
                    <h5>Hoàn Thành</h5>
                    <h3>{stats.studentsCompleted}</h3>
                    <p>Sinh viên hoàn thành thực tập</p>
                  </div>
                </div>
              </div>

              {/* Chọn học kỳ */}
              <div className="mb-5">
                <label className="fs-4 fw-bold mb-3">Chọn học kỳ:</label>
                <select
                  className="form-control fs-4"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                >
                  <option value="HK1">HK1 2025-2026</option>
                  <option value="HK2">HK2 2025-2026</option>
                  <option value="HKHE">HK Hè 2025-2026</option>
                </select>
              </div>

              {/* Biểu đồ thống kê sinh viên */}
              <div className="bg-white rounded shadow p-5 mb-5">
                <div className="row g-4 text-center">
                  <div className="col-md-6">
                    <h2 className="fs-3 fw-bold mb-4">Thống Kê Sinh Viên</h2>
                    <div className="card shadow-sm p-4">
                      <h4 className="mb-3">Biểu đồ Sinh Viên</h4>
                      <div style={{ maxWidth: '350px', margin: '0 auto' }}>
                        <Doughnut data={studentChartData} options={options} />
                      </div>
                      <h4 className="mt-3">Tổng số sinh viên: {stats.totalStudents}</h4>
                    </div>
                  </div>

                  {/* Biểu đồ thống kê bài đăng */}
                  <div className="col-md-6">
                    <h2 className="fs-3 fw-bold mb-4">Thống Kê Bài Đăng</h2>
                    <div className="card shadow-sm p-4">
                      <h4 className="mb-3">Biểu đồ Bài Đăng</h4>
                      <div style={{ maxWidth: '350px', margin: '0 auto' }}>
                        <Doughnut data={jobChartData} options={options} />
                      </div>
                      <h4 className="mt-3">Tổng số bài đăng: {stats.jobPosts + stats.events}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Các chức năng quản lý khác */}
            <div className="mt-5">
              <h2 className="fs-3 fw-bold mb-4">Tìm kiếm & Quản lý Hồ Sơ</h2>
              <div className="row g-4 text-center">
                <div className="col-md-4">
                  <Link href="/faculty/jobs" className="btn btn-outline-primary w-100 py-4 fs-4">
                    <i className="fa fa-briefcase fa-2x mb-3 d-block" />
                    Quản Lý Bài Đăng
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link href="/faculty/applications" className="btn btn-outline-success w-100 py-4 fs-4">
                    <i className="fa fa-users fa-2x mb-3 d-block" />
                    Xem hồ sơ ứng tuyển
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link href="/post-job" className="btn btn-danger w-100 py-4 fs-4">
                    <i className="fa fa-plus-circle fa-2x mb-3 d-block" />
                    Đăng tin mới
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
