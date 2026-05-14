<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div class="lang-trigger">
      <span class="lang-label" v-if="language === 'zh_CN'">语言</span>
      <span class="lang-label" v-else>Language</span>
      <span class="divider">|</span>
      <span class="lang-text">{{ langText }}</span>
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>

    <el-dropdown-menu slot="dropdown" class="lang-dropdown">
      <el-dropdown-item :disabled="language==='zh_CN'" command="zh_CN" class="lang-item">
        中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en_US'" command="en_US" class="lang-item">
        English
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { changeLanguage } from "@/api/login";


export default {
  computed: {
    language() {
      return this.$store.getters.language || 'zh_CN';
    },
    // 动态显示当前语言文字
    langText() {
      return this.language === 'zh_CN' ? '中文' : 'English';
    }
  },
  methods: {
    handleSetLanguage(value) {
      this.$i18n.locale = value;
      this.$store.dispatch('app/setLanguage', value);
      // this.$message({ message: '设置语言成功', type: 'success' })

      // changeLanguage(value).then(res => {
      //   window.location.reload();
      // });
    }
  }
}
</script>

<style scoped>
/* 语言按钮整体 */
.lang-trigger {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 10px;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
}

/* 语言标签 */
.lang-label {
  font-weight: 500;
  margin-right: 4px;
}

/* 分隔线 */
.divider {
  margin: 0 6px;
  color: rgba(255, 255, 255, 0.6);
}

/* 当前显示文字 */
.lang-text {
  margin-right: 6px;
}

/* 图标 */
.international-icon {
  font-size: 16px;
  color: #fff;
}

/* 下拉菜单美化 */
.lang-dropdown {
  width: 150px !important;
  border-radius: 4px;
}

/* 下拉选项美化 */
.lang-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 15px !important;
  font-size: 14px;
}

.lang-item .en,
.lang-item .cn {
  color: #909399;
  font-size: 12px;
}

/* 禁用样式 */
.lang-item.is-disabled {
  background: #f5f7fa !important;
  opacity: 0.7;
}
</style>
